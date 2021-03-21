const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "stop",
    description: "Arrête la musique.",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("*Tu dois être dans un salon vocale pour fonctionner.*", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("*Il n'y a aucune chanson jouée actuellement.*", message.channel);
   if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     try{
      serverQueue.connection.dispatcher.end();
      } catch (error) {
        message.guild.me.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: *La musique a arrêté de jouer et la liste a été supprimé :* ${error}`, message.channel);
      }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react("✅")
  },
};