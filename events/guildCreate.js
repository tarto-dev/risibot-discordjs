module.exports = (client, guild) => {
    client.user.setActivity(`http://bot.benftwc.fr - ${client.guilds.size} serveurs | ${client.channels.size} channels | ${client.members.size} kheys`);

    const io = require('@pm2/io')

    const commandUsages = io.meter({
        name: 'Guilds count',
        id: 'app/guilds/count'
    })
    commandUsages.inc()

    const embed = {
        "title": `NOUVEAU SERVEUR (${guild.name})`,
        "color": 4886754,
        "fields": [
            {
                "name": "Nom",
                "value": guild.name
            },
            {
                "name": "ID",
                "value": guild.id
            },
            {
                "name": "Utilisateurs",
                "value": guild.memberCount
            }
        ]
    };

    client.users.get(client.config.root_user).send({ embed });
    client.channels.get(client.config.log_discord_channel).send({ embed });
    // First, ensure the settings exist
    client.settings.ensure(guild.id, client.defaultSettings);
}