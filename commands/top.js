exports.run = (client, message, args) => {

    // Get a filtered list (for this guild only), and convert to an array while we're at it.
    const filtered = client.points.filter( p => p.guild === message.guild.id ).array();

    // Sort it to get the top results... well... at the top. Y'know.
    const sorted = filtered.sort((a, b) => b.points - a.points);

    // Slice it, dice it, get the top 10 of it!
    const top10 = sorted.splice(0, 10);

    let embedFields = top10.map(data => {
        return {"name": client.users.get(data.user).tag, "value": `${data.points || 0} points || LVL: ${data.level || 1} | XP: ${data.xp || 0} || `};
    });

    const embed = {
        "title": `LEADERBOARD (${message.guild.name})`,
        "color": 4886754,
        "fields": embedFields
    };

    console.log(embedFields);


    return message.channel.send({embed});
}