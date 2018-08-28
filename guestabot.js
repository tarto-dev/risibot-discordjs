const Discord = require('discord.js');
const client = new Discord.Client();

const Risibank = require('risibank');
var rb = new Risibank.RisiBank();

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const config = require("./config.json");

var prefix = config.prefix;
var prefixSize = prefix.length;
var admin_role_name = config.admin_role_name
var risibank_show_tags = config.show_risitags;
var risibank_celestin = config.celestin;

client.on('ready', () => {
    console.log(`${client.user.tag} has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`${prefix} - Propage la bonne parole sur ${client.guilds.size} serveurs`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`${prefix} - Propage la bonne parole sur ${client.guilds.size} serveurs`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`${prefix} - Propage la bonne parole sur ${client.guilds.size} serveurs`);
});

client.on('message', async msg => {
    // Prevent "botception".
    if (msg.author.bot) return;
    var troll_bot_idx = msg.content.indexOf("bot");
    var troll_answers = ["Hmm ? Ça parle de moi ?", "T'as un soucis a parler de moi ? Tu veux que j'appelle Shlomo ?", "Trouve toi un pote frère, arrête de me citer comme ça..."];
    if(troll_bot_idx > 0) {
        msg.reply(troll_answers[Math.floor(Math.random()*troll_answers.length)]);
    }

    if (msg.content.indexOf(config.prefix) !== 0) return;

    if (config.debug && msg.author.id != config.root_user) {
        return;
    }
    if (command = isCommand(msg.content)) {
        if (command.startsWith('ping')) {
            msg.reply('Pong!');
        }

        if (command.startsWith('risibank') || command.startsWith('risitas')) {

            params = command.slice(prefixSize + 8);
            if(command.startsWith('risitas')) {
                params = command.slice(prefixSize + 7);
            }
            removeCaller(msg, 'risibank');

            var search = rb.searchStickers(params);
            search.then(function(data) {
                if(data[Object.keys(data)[0]] == undefined) {
                    msg.reply("J'ai pas trouvé de de sticker correspondant à " + params, {
                        file: 'http://image.noelshack.com/fichiers/2017/20/1495053127-paslebol.png'
                    });
                } else {
                    if(risibank_celestin) {
                        msg.reply('demande a afficher ' + params + ' ... #BalanceTonCelestin', {
                            file: data[Object.keys(data)[0]].risibank_link
                        });
                    } else {
                        if(!risibank_show_tags) {
                            params = '';
                        }
                        msg.channel.send('' + params, {
                            file: data[Object.keys(data)[0]].risibank_link
                        });
                    }
                }
            })
        }

        if (command.startsWith('help') || command.startsWith('aled')) {
            msg.reply("Commandes accessibles : `credits`, `risibank <mot clés>`");
            msg.channel.send("Commandes ADMIN : RISITAGS, LEGANGE, SETPREFIX");
            msg.channel.send("Le préfix actuellement est " + prefix);
        }

        if(command.startsWith("credits")) {
            msg.channel.send("Merci à la risibank (https://risibank.fr/) et à l'élite (https://2sucres.org/)")
            msg.channel.send("Dev par poneygenial avec les encouragements de Ourx");
        }

        if(command.startsWith('RISITAGS') && no_access(msg)) {
            if(risibank_show_tags) {
                risibank_show_tags = false;
                msg.channel.send("Ok, j'arrête de t'afficher avec les tags chelous sur la risibank :ok_hand: :grin:");
            } else {
                risibank_show_tags = true;
                msg.channel.send("Ok, si t'assumes d'afficher tout tes tags chelous sur la risibank :ok_hand: :grin:");
            }
        }

        if(command.startsWith('CELESTIN') && no_access(msg)) {
            if(risibank_celestin) {
                risibank_celestin = false;
                msg.channel.send("Ok, j'arrête d'afficher les Celestins :ok_hand: :grin:");
            } else {
                risibank_celestin = true;
                msg.channel.send("Ok, c'est parti pour afficher les Celestins :ok_hand: :grin:");
            }
        }


        if (command.startsWith('SETPREFIX') && no_access(msg)) {
            params = command.slice(prefixSize + 9);
            prefix = params;
            prefixSize = prefix.length;
            msg.reply('New prefix setted. Is now ' + prefix);
            console.log('prefix updated');
        }

        if (command.startsWith('LEGANGE') && no_access(msg)) {
            removeCaller(msg, 'LEGANGE');
            var n = 0;
            while (n < config.gange_lines) {
                const fetched = await msg.channel.fetchMessages({limit: 100});
                msg.channel.bulkDelete(fetched)
                    .catch(error => msg.reply(`Couldn't delete messages because of: ${error}`));

                n++;
            }
            msg.channel.send(":ok_hand: :grin:",{
                file: "http://image.noelshack.com/fichiers/2017/38/5/1506113458-purificationgange.jpg"
            }
        );
        }
    }
});

client.login(config.token);

function isCommand(msg) {
    prefixSize = prefix.length;
    candidat = msg.substr(0, prefixSize);
    if (candidat === prefix) {
        command = msg.slice(prefixSize);
        //console.log('COMMAND OK : ' + command);
        return command;
    }
    //console.log('IS NOT A COMMAND');
    return false;
}

function getRisibankRelated(search) {
    if (search === 'random' || search === 'rng') {
        rng = getRandomInt(201, 297);

        return 'https://risibank.fr/cache/stickers/d2/' + rng + '-static.png';
    }
    (async (url) => {
        code = await getScript(url);
        dom = new JSDOM(code);
        imageUrl = dom.window.document.querySelector(".risicard:first-child img").dataset.src;
        //console.log("Triggered img : " + imageUrl);
        return imageUrl;
    })('https://risibank.fr/#' + search.replace(' ', '+'));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function no_access(msg) {
    if (!msg.member.roles.some(r => [admin_role_name].includes(r.name))) {
        msg.reply(":410: commande suicidée ! - Recommence et je te pète les jambes petit fdp.");
        return false;
    }
    return true;
}

const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http = require('http'),
            https = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};

function removeCaller(msg, caller = '') {
    caller_log = caller.length ? ' [' + caller + '] ' : '';

    msg.delete(300).then(msg => console.log(`${caller} Auto-deleted message from ${msg.author.username}`));
}