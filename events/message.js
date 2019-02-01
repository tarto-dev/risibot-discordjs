module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    if (!message.guild) return;

    const guildConf = client.settings.ensure(message.guild.id, client.defaultSettings);
    client.guildConf = guildConf;

    ///////////////////////////////////////////////////
    //////////////////      INIT        ///////////////
    ///////////////////////////////////////////////////
    if(!client.guildConf.hasOwnProperty('score')) {
        client.guildConf.score = true;
    }

    if(!client.guildConf.hasOwnProperty('nsfwOnly')) {
        client.guildConf.nsfwOnly = "off";
    }
    
    if(!client.guildConf.hasOwnProperty('history')) {
        client.guildConf.history = 4;
    }
    if(!client.guildConf.hasOwnProperty('sticker404')) {
        client.guildConf.sticker404 = "http://image.noelshack.com/fichiers/2018/01/5/1515108350-410.png";
    }
    if(!client.guildConf.hasOwnProperty('disable_vote')) {
        client.guildConf.disable_vote = false;
    }

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(guildConf.prefix) !== 0) return;

    // Our standard argument/command name definition.
    const args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    const scored_actions = ['risitas', 'risibank', 'waifu'];
    if ((client.guildConf.score && scored_actions.indexOf(command) !== -1)) {
        // We'll use the key often enough that simplifying it is worth the trouble.
        const key = `${message.guild.id}-${message.author.id}`;

        // Triggers on new users we haven't seen before.
        client.points.ensure(`${message.guild.id}-${message.author.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            points: 0,
            level: 1
        });
        client.points.inc(key, "points");

        client.risistory.ensure(message.guild.id, {tags: []});
        client.risistory.push(message.guild.id, args.join(' '), 'tags', true);

        // Calculate the user's current level
        const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));

        // Act upon level up by sending a message and updating the user's level in enmap.
        if (client.points.get(key, "level") < curLevel) {
            message.reply(`A force de stickers, tu passe au niveau **${curLevel}**! `);
            client.points.set(key, curLevel, "level");
        }
    }

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;

    // Run the command
    cmd.run(client, message, args);
};