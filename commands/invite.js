exports.run = (client, message, args) => {
    message.delete();
    message.author.sendMessage(`Tu peux ajouter Gilbot chez toi en cliquant sur https://discordapp.com/api/oauth2/authorize?client_id=484127854326710300&permissions=8&scope=bot :smirk:.`);
}

exports.help = {
    name: "ping",
    category: "Miscelaneous",
    description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
    usage: "ping"
};