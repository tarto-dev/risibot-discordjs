const Discord = require('discord.js');
const client = new Discord.Client();

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const config = require("./config.json");

client.on('ready', () => {
    console.log(`${client.user.tag} has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers - commit n.` + lastID);

});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

var prefix = config.prefix;

client.on('message', msg => {

    // Prevent "botception".
    if (message.author.bot) return;

    if (config.debug && msg.author.id != config.root_user) {
        return;
    }
    if (command = isCommand(msg.content)) {
        if (command.startsWith('ping')) {
            msg.reply('Pong!');
        }

        if (command.startsWith('risibank')) {
            params = command.slice(9);
            risibankUrl = getRisibankRelated(params);
            msg.delete(100).then(msg => console.log(`Auto-deleted message from ${msg.author.username}`));
            msg.channel.send('', {
                file: risibankUrl
            });
        }

        if (command.startsWith('prefix')) {
            msg.reply('Current prefix is *' + prefix + '*. To change it, please type `' + prefix + 'setprefix X` where X is the prefix');
        }

        if (command.startsWith('setprefix')) {
            params = command.slice(10);
            prefix = params;
            msg.reply('New prefix setted. Is now ' + prefix);
            console.log('prefix updated');
        }

        if (command.startsWith('help') || command.startsWith('aled')) {
            msg.reply("For now, some commands are available : help, aled, prefix, setprefix, risibank");
            msg.reply("The used prefix is " + prefix);
        }

        if (command.startsWith('LE GANGE')) {

            // So we get our messages, and delete them. Simple enough, right?
            const fetched = await
            message.channel.fetchMessages({limit: 500});
            message.channel.bulkDelete(fetched)
                .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

            msg.reply(":ok_hand: :grin:" + prefix).delete(500);
        }
    }
});

client.login(config.token);

function isCommand(msg) {
    prefixSize = prefix.length;
    //console.log('prefix is (iscommand) ' + prefix + '- size : ' + prefixSize);
    candidat = msg.substr(0, prefixSize);
    //console.log('Candidat (iscommand) ' + candidat);
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