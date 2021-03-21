const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require("ytpl");
const sendError = require("../util/error");
const fs = require("fs");
const scdl = require("soundcloud-downloader").default;
module.exports = {
    info: {
        name: "playlist",
        description: "Le bot va chanter la playlist que tu veux.",
        usage: "<YouTube Playlist URL | Playlist Name>",
        aliases: ["pl"],
    },

    run: async function (client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return sendError("*Tu dois être dans un salon vocale pour fonctionner.*", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var searchString = args.join(" ");
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("*Je ne peut pas me connecter au canal vocal, vérifie que j'ai les permissions.*", message.channel);
        if (!permissions.has("SPEAK")) return sendError("*Je n'ai pas la permission de parler dans le canal vocal, vérifie que j'ai les permissions.*", message.channel);

        if (!searchString || !url) return sendError(`Usage: ${message.client.config.prefix}playlist <YouTube Playlist URL | Playlist Name>`, message.channel);
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            try {
                const playlist = await ytpl(url.split("list=")[1]);
                if (!playlist) return sendError("Playlist introuvable", message.channel);
                const videos = await playlist.items;
                for (const video of videos) {
                    // eslint-disable-line no-await-in-loop
                    await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
                }
                return message.channel.send({
                    embed: {
                        color: "GREEN",
                        description: `✅  **|**  Playlist: **\`${videos[0].title}\`** à bien été rajouté a la liste.`,
                    },
                });
            } catch (error) {
                console.error(error);
                return sendError("*Playlist introuvable.*", message.channel).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);

                if (searched.playlists.length === 0) return sendError("*On dirait que j’ai été incapable de trouver la playlist sur YouTube.*", message.channel);
                var songInfo = searched.playlists[0];
                let listurl = songInfo.listId;
                const playlist = await ytpl(listurl);
                const videos = await playlist.items;
                for (const video of videos) {
                    // eslint-disable-line no-await-in-loop
                    await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
                }
                let thing = new MessageEmbed()
                    .setAuthor("Playlist rajouté à la liste", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
                    .setThumbnail(songInfo.thumbnail)
                    .setColor("GREEN")
                    .setDescription(`✅  **|**  Playlist: **\`${songInfo.title}\`** à bien été rajouté \`${songInfo.videoCount}\` video à la liste.`);
                return message.channel.send(thing);
            } catch (error) {
                return sendError("*Une erreur à été détécté.*", message.channel).catch(console.error);
            }
        }

        async function handleVideo(video, message, channel, playlist = false) {
            const serverQueue = message.client.queue.get(message.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                views: video.views ? video.views : "-",
                ago: video.ago ? video.ago : "-",
                duration: video.duration,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                img: video.thumbnail,
                req: message.author,
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 80,
                    playing: true,
                    loop: false,
                };
                message.client.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);

                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`*Je ne peut pas rejoindre le salon vocal :* ${error}`);
                    message.client.queue.delete(message.guild.id);
                    return sendError(`*Je ne peut pas rejoindre le salon vocal :* ${error}`, message.channel);
                }
            } else {
                serverQueue.songs.push(song);
                if (playlist) return;
                let thing = new MessageEmbed()
                    .setAuthor("Musique rajouté à la liste :", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
                    .setThumbnail(song.img)
                    .setColor("YELLOW")
                    .addField("Nom :", song.title, true)
                    .addField("Durée :", song.duration, true)
                    .addField("Demandé par :", song.req.tag, true)
                return message.channel.send(thing);
            }
            return;
        }

        async function play(guild, song) {
            const serverQueue = message.client.queue.get(message.guild.id);
            if (!song) {
                sendError(
                    "*Une erreur est survenue.*",
                    message.channel
                );
                message.client.queue.delete(message.guild.id);
                return;
            }
            let stream = null;
            let streamType;

            try {
                if (song.url.includes("soundcloud.com")) {
                    try {
                        stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, client.config.SOUNDCLOUD);
                    } catch (error) {
                        stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, client.config.SOUNDCLOUD);
                        streamType = "unknown";
                    }
                } else if (song.url.includes("youtube.com")) {
                    stream = await ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus" });
                    stream.on("error", function (er) {
                        if (er) {
                            if (serverQueue) {
                                serverQueue.songs.shift();
                                play(serverQueue.songs[0]);
                                return sendError(`*Une erreur est parvenue.*\nPossible erreur : \`${er}\``, message.channel);
                            }
                        }
                    });
                }
            } catch (error) {
                if (serverQueue) {
                    console.log(error);
                    serverQueue.songs.shift();
                    play(serverQueue.songs[0]);
                }
            }
            serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
            const dispatcher = serverQueue.connection.play(stream).on("finish", () => {
                const shiffed = serverQueue.songs.shift();
                if (serverQueue.loop === true) {
                    serverQueue.songs.push(shiffed);
                }
                play(guild, serverQueue.songs[0]);
            });

            dispatcher.setVolume(serverQueue.volume / 100);
            let thing = new MessageEmbed()
                .setAuthor("La musique viens de se lancer :", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
                .setThumbnail(song.img)
                .setColor("BLUE")
                .addField("Nom :", song.title, true)
                .addField("Durée :", song.duration, true)
                .addField("Demandé par :", song.req.tag, true)
            serverQueue.textChannel.send(thing);
        }
    },
};
