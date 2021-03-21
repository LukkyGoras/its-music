const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skipto",
    description: "Skip la musique séléctionné par le nombre :",
    usage: "skipto <number>",
    aliases: ["st"],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
                        embed: {
                            color: "GREEN",
                            description: `**Usage**: \`${client.config.prefix}skipto <nombre>\``
                        }
   
                   }).catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("*Il n'y a pas de liste.*",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`*La liste joue ${queue.songs.length} actuellement.*`,message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return sendError(`:notes: *La musique a arrêté de jouer et la liste a été supprimé :* ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: "GREEN",
                            description: `${message.author} ⏭ skipped \`${args[0] - 1}\` musiques.`
                        }
   
                   }).catch(console.error);
                   message.react("✅")

  },
};
