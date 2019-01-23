exports.run = (client, message, args) => {
    const Risibank = require('risibank');
    const rb = new Risibank.RisiBank();

    if (client.config.vote) {
        const DBL = require("dblapi.js");
        const dbl = new DBL(config.dblapi_apikey, client);

        dbl.hasVoted(message.author.id).then(data => {
            if (data === false) {
                message.author.sendMessage(`Merci de nous aider en allant voter mon khey (https://discordbots.org/bot/484127854326710300/vote), en échange tu peux utiliser la risibank :) `,
                    {"file": "http://image.noelshack.com/fichiers/2017/13/1491143279-risitas-avote.png"}
                );
                return;
            }
        })
    }

    const fs = require("fs")
    client.risicount++;
    fs.writeFile("./risicount.json", JSON.stringify(client.risicount), (err) => console.error);

    let params = args.join(' ');
    
    // Dans le doute, retire "<" et ">" afin d'éviter à Jean Kévin de ne pas obtenir de résultat et de pleurer CÉ PÉTÉ
    params = params.replace('<', '').replace('>', '');

    message.delete();

    let search = rb.searchStickers(params);
    search.then(function (data) {
        if (args.length > 5) {
            message.author.sendMessage("Je te conseil de pas envoyer plus de 5 mots clés :wink:")
        }
        if (data[Object.keys(data)[0]] == undefined) {
            message.reply("J'ai pas trouvé de de sticker correspondant à " + params, {
                file: 'http://image.noelshack.com/fichiers/2017/20/1495053127-paslebol.png'
            });
        } else {
            if (!client.config.show_risitags) {
                params = '';
            }

            message.channel.send('' + params, {
                file: data[Object.keys(data)[0]].risibank_link
            });
        }
    })
}