const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "pause",
    description: "Mets la musique en pause sur le serveur.",
    usage: "[pause]",
    aliases: ["pause"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
	    try{
      serverQueue.connection.dispatcher.pause()
	  } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Un utilisateur à mis en pause la musique : ${error}`, message.channel);
      }	    
      let xd = new MessageEmbed()
      .setDescription("Musique en pause avec succès.")
      .setColor("YELLOW")
      .setTitle("⏸ Pause")
      return message.channel.send(xd);
    }
    return sendError("*Aucune musique n'est joué actuellement.*", message.channel);
  },
};
