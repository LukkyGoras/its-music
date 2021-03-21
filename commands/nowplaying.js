const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "Vous montres la musique qui est actuellement joué.",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("*Aucune musique n'est joué actuellement.*", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Now Playing :", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Nom :", song.title, true)
      .addField("Durée :", song.duration, true)
      .addField("Demandé par :", song.req.tag, true)
    return message.channel.send(thing)
  },
};
