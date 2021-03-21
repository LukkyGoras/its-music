const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "leave",
        aliases: ["goaway", "disconnect", "lv"],
        description: "*Quitte le salon vocal.*",
        usage: "Leave",
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("*Je dois être dans un canal vocal pour fonctionner.*", message.channel);
        if (!message.guild.me.voice.channel) return sendError("*Je ne suis dans aucun canal vocal .*", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("*J'essaye de quitter le canal vocale, mais...*", message.channel);
        }

        const Embed = new MessageEmbed()
            .setAuthor("Déconnexion", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
            .setColor("GREEN")
            .setDescription("*🎶 | Déconnexion avec succès.*")
            .setTimestamp();

        return message.channel.send(Embed).catch(() => message.channel.send("*🎶 | Déconnexion avec succès.*"));
    },
};
