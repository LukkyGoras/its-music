const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "remove",
    description: "Retire la musique de la liste",
    usage: "rm <number>",
    aliases: ["rm"],
  },

  run: async function (client, message, args) {
   const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("*Il ny'a a aucune liste.*",message.channel).catch(console.error);
    if (!args.length) return sendError(`*Usage : ${client.config.prefix}\`remove <numéro de la chanson>*\``);
    if (isNaN(args[0])) return sendError(`*Usage : ${client.config.prefix}\`remove <numéro de la chanson>*\``);
    if (queue.songs.length == 1) return sendError("There is no queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`*La liste n'a plus que ${queue.songs.length} chanson.*`,message.channel).catch(console.error);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    sendError(`❌ **|** Suppression : **\`${song[0].title}\`** de la liste.`,queue.textChannel).catch(console.error);
                   message.react("✅")
} catch (error) {
        return sendError(`:notes: *Une erreur est parvenue.*\nPossible erreur : ${error}`, message.channel);
      }
  },
};
