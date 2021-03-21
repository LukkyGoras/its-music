const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "lyrics",
    description: "Affiche les paroles de la chanson.",
    usage: "[lyrics]",
    aliases: ["ly"],
  },

  run: async function (client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("*Aucune musique n'est joué actuellement.*",message.channel).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `*Lyrics introuvable pour ${queue.songs[0].title}.*`;
    } catch (error) {
      lyrics = `*Lyrics introuvable pour ${queue.songs[0].title}.*`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor(`${queue.songs[0].title} — Lyrics`, "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(queue.songs[0].img)
      .setColor("YELLOW")
      .setDescription(lyrics)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  },
};
