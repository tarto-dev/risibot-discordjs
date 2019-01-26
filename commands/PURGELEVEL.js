exports.run = async (client, message, args) => {
    message.delete();

    if (!client.utils.has_perm(message, 'ADMINISTRATOR', true))
        return;

    // Get a filtered list (for this guild only).
    const filtered = client.points.filter( p => p.guild === message.guild.id );

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow = new Date();
    const toRemove = filtered.filter(data => {
        return !message.guild.members.has(data.user) || rightNow - 2592000000 > data.lastSeen;
    });

    if(args[0] === "all") {
        filtered.forEach(data => {
            client.points.set(`${message.guild.id}-${data.user}`,0, "points");
            client.points.set(`${message.guild.id}-${data.user}`,1, "level");
        });

        message.channel.send(`Les points de ${filtered.size} comptes sont a présent retirés.`);
    } else {
        toRemove.forEach(data => {
            client.points.set(`${message.guild.id}-${data.user}`,0, "points");
            client.points.set(`${message.guild.id}-${data.user}`,1, "level");

        });

        message.channel.send(`Les points de ${toRemove.size} comptes inactifs sont a présent retirés.`);
    }
}