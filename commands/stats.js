exports.run = (client, message) => {

    const io = require('@pm2/io')

    const commandUsages = io.counter({
        name: 'stats',
        id: 'app/commands/stats'
    })
    commandUsages.inc()

    message.reply(`Depuis mon reboot, j'ai déjà envoyé ${client.risicount.count} stickers :joy:`);
    message.reply(`J'offre actuellement du bonheur à ${client.users.size} personnes a travers ${client.channels.size} channels de ${client.guilds.size} serveurs. Ouf hein ?! Merci !!`,
        { file: "http://i.imgur.com/hbDcYsZ.gif" }
    );
}