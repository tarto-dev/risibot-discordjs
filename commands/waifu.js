exports.run = (client, message, args) => {
    const Risibank = require('risibank');
    const rb = new Risibank.RisiBank();

    const io = require('@pm2/io')

    const commandUsages = io.counter({
        name: 'waifu',
        id: 'app/commands/waifu'
    })
    commandUsages.inc()

    if (!client.guildConf.disable_vote) {
        const DBL = require("dblapi.js");
        const dbl = new DBL(client.config.dblapi_apikey, client);

        dbl.hasVoted(message.author.id).then(data => {
            if (data === false) {
                message.author.sendMessage(`Merci de nous aider en allant voter mon khey (https://discordbots.org/bot/484127854326710300/vote), en échange tu peux utiliser la risibank :) `,
                    { "file": "http://image.noelshack.com/fichiers/2017/13/1491143279-risitas-avote.png" }
                );
                return;
            }
        })
    }

    const fs = require("fs")
    client.risicount.count++;
    fs.writeFile("./risicount.json", JSON.stringify(client.risicount), (err) => console.error);

    message.delete();

    if (!message.channel.nsfw && client.guildConf.nsfwOnly === "on") {
        message.author.send(`Le salon \`#${message.channel.name}\` du serveur \`${message.guild.name}\` bloque les stickers dans les salons "non NSFW"`);
        return;
    }

    let search = rb.searchStickers("waifu");
    search.then(function (data) {
        if (data[Object.keys(data)[0]] != undefined) {
            message.channel.send('', {
                file: data[client.utils.getRandomInt(0, data.length)].risibank_link
            });
        }
    })
}