exports.run = (client, message, args) => {

    const io = require('@pm2/io')

    const commandUsages = io.counter({
        name: 'credits',
        id: 'app/commands/credits'
    })
    commandUsages.inc()

    message.channel.send("Merci à la risibank (https://risibank.fr/) et à l'élite (https://2sucres.org/)")
    message.channel.send("Dev par Benftwc/poneygenial avec les encouragements de Ourx");
}