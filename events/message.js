module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    const guildConf = client.settings.ensure(message.guild.id, client.defaultSettings);

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(guildConf.prefix) !== 0) return;

    // Our standard argument/command name definition.
    const args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    client.guildConf = guildConf;

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;

    // Run the command
    cmd.run(client, message, args);
};