const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Change le volume du bot.",
    usage: "[volume]",
    aliases: ["v", "vol", "vl"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("*Tu dois être dans un salon vocale pour fonctionner.*", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("*Aucune musique n'est jouée actuellement.*", message.channel);
    if (!serverQueue.connection) return sendError("*Aucune musique n'est jouée actuellement.*", message.channel);
    if (!args[0])return message.channel.send(`*Volume actuelle : ${serverQueue.volume}*`);
     if(isNaN(args[0])) return message.channel.send(':notes: *Nombre seulement.*').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('*Tu ne peut pas mettre la musique supérieur à 100 ou inférieur à 0*',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .setDescription(`**Volume : ${args[0]/1}/100**`)
    .setAuthor("Volume manager :", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
