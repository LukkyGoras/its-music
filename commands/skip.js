const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skip",
    description: "Skip la chanson.",
    usage: "",
    aliases: ["s", "sk"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("*Tu dois être dans un salon vocale pour fonctionner.*", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("*Il n'y a auncune musique à jouer esuite.*", message.channel);
        if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("*La musique a reprit*")
      .setColor("YELLOW")
      .setTitle("▶ Resume :")
       
   return message.channel.send(xd).catch(err => console.log(err));
      
    }


       try{
      serverQueue.connection.dispatcher.end()
      } catch (error) {
        serverQueue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: *La musique a arrêté de jouer et la liste a été supprimé :* ${error}`, message.channel);
      }
    message.react("✅")
  },
};
