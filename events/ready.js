module.exports = async (client) => {
  console.log(`[API] Logged in as ${client.user.username}`);
  const statuses = [
    () => `${client.config.prefix}help`
]
let i = 0
setInterval(() => {
    client.user.setActivity(statuses[i](), {type: 'STREAMING', url: "https://twitch.tv/graphic"})
    i = ++i % statuses.length
}, 1e4)
}