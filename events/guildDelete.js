module.exports = (client, guild) => {
    client.user.setActivity(`http://bot.benftwc.fr - ${client.guilds.size} serveurs | ${client.channels.size} channels | ${client.members.size} kheys`);

    const io = require('@pm2/io')

    const commandUsages = io.counter({
        name: 'Guilds count',
        id: 'app/guilds/count'
    })
    commandUsages.dec()

    const embed = {
        "title": `SERVEUR SUPPRIMÉ (${guild.name})`,
        "color": 13632027,
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

    // When the bot leaves or is kicked, delete settings to prevent stale entries.
    client.settings.delete(guild.id);

    client.users.get(client.config.root_user).send({ embed });
    client.channels.get(client.config.log_discord_channel).send({ embed });
}