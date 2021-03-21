const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "loop",
    description: "Fait tourner la musique en boucle.",
    usage: "loop",
    aliases: ["l"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Loop  **\`${serverQueue.loop === true ? "activé" : "désactivé"}\`**`
                }
            });
        };
    return sendError("*Aucune musique n'est joué actuellement.*", message.channel);
  },
};
