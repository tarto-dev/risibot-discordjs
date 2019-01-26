exports.run = (client, message, args) => {

    if (client.guildConf.adminRole != "") {
        const adminPerm = client.utils.has_perm(message, 'ADMINISTRATOR', false);
        ;

        // Then we'll exit if the user is not admin
        if (!adminPerm) {
            return message.reply("Désolé khey, t'es pas admin!");
        }

    }

    if (args.length === 0) {
        let configProps = Object.keys(client.guildConf).map(prop => {
            return `${prop} = ${client.guildConf[prop]}`;
        });

        message.channel.send(`Configuration actuelle du serveur:
        \`\`\`${configProps.join("\n")}\`\`\``);

    } else {
        // New setting getter
        const [prop, ...value] = args;

        // Example:
        // prop: "prefix"
        // value: ["+"]

        // We can check that the key exists to avoid having multiple useless,
        // unused keys in the config:
        if (!client.settings.has(message.guild.id, prop)) {
            return message.reply("This key is not in the configuration.");
        }

        // Now we can finally change the value. Here we only have strings for values
        // so we won't bother trying to make sure it's the right type and such.
        client.settings.set(message.guild.id, value.join(" "), prop);

        // We can confirm everything's done to the client.
        message.channel.send(`Nouvelle configuration pour \`${prop}\` :\n\`${value.join(" ")}\``);
    }
}