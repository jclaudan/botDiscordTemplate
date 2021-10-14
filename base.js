const Discord = require('discord.js');
const client = new Discord.Client();

// const axios = require('axios');
// const cheerio = require('cheerio');
const discordParser = require('discord-command-parser');

const tokenClient = process.env.TOKEN_CLIENT


// Fun
const selectResponseMessage = async (message) => {
    try {
        // Allow verify is the message contain a command, in this case the key word is "!" 
        const parsed = discordParser.parse(message, "!", { allowSpaceBeforeCommand: true });

        // If message is not a command return nothing
        if (!parsed.success) return;

        //  Example of command implementation
        if (parsed.command === "pong") {
            return message.reply(createMessageWithDecorator());
        }
    } catch (error) {
        console.log({error});
        throw new Error('Error command')
    }

}

client.login(tokenClient);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    try {
        return await selectResponseMessage(message)
    } catch (error1) {
        console.log({error1});
        return message.reply('Error bad command');
    }
});

// ----------------------------------------------------------------------------------------------
// DateTime Utils
const DateTime = require('luxon').DateTime

const FRENCH_TIME_ZONE = 'Europe/Paris'

const frenchOptions = { locale: 'fr', zone: FRENCH_TIME_ZONE }

const getFrenchLuxonFromIso = isoDate => isoDate && DateTime.fromISO(isoDate, frenchOptions)

const getFrenchDateFromXslx = xslxDate => DateTime.fromFormat(xslxDate, 'dd/MM/yy HH:mm', frenchOptions)

const getFrenchLuxonFromJSDate = jsDate => DateTime.fromJSDate(jsDate, frenchOptions)

const getFrenchLuxonFromSql = sqlDate =>
    sqlDate && DateTime.fromSQL(sqlDate, frenchOptions)

const getFrenchLuxonFromObject = obj => obj && DateTime.fromObject({ ...obj, ...frenchOptions })

const getFrenchDateFromLuxon = dateTime =>
    dateTime &&
    dateTime
    .setLocale('fr')
    .setZone(FRENCH_TIME_ZONE)
    .toLocaleString({
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
    })

const getFrenchDateTimeFromLuxon = dateTime =>
    dateTime &&
    dateTime
    .setLocale('fr')
    .setZone(FRENCH_TIME_ZONE)
    .toLocaleString({
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

const getFrenchDateFromIso = isoDate => {
    return isoDate && getFrenchDateFromLuxon(getFrenchLuxonFromIso(isoDate))
}

const getFrenchDateTimeFromIso = isoDate =>
    isoDate &&
    getFrenchLuxonFromIso(isoDate).toLocaleString({
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

const getFrenchLuxonCurrentDateTime = () =>
    DateTime.local()
        .setLocale('fr')
        .setZone(FRENCH_TIME_ZONE)

const getFrenchLuxon = (...args) =>
    DateTime.local(...args)
        .setLocale('fr')
        .setZone(FRENCH_TIME_ZONE)

const getFrenchWeeksInWeekYear = year =>
    DateTime.local(year)
        .setLocale('fr')
        .setZone(FRENCH_TIME_ZONE).weeksInWeekYear

const getFrenchFormattedDateFromObject = (obj, shape) =>
    obj ? getFrenchLuxonFromObject(obj, frenchOptions).toLocaleString(shape) : 'Invalid DateTime'

const dateTools = {
    FRENCH_TIME_ZONE,
    frenchOptions,
    getFrenchLuxonFromIso,
    getFrenchDateFromXslx,
    getFrenchLuxonFromJSDate,
    getFrenchLuxonFromSql,
    getFrenchLuxonFromObject,
    getFrenchDateFromLuxon,
    getFrenchDateTimeFromLuxon,
    getFrenchDateFromIso,
    getFrenchDateTimeFromIso,
    getFrenchLuxonCurrentDateTime,
    getFrenchLuxon,
    getFrenchWeeksInWeekYear,
    getFrenchFormattedDateFromObject,
}

// -------------------------------------------------------------------------------------------------------------------
// Example

    // const defaultFields = [
    //     { name: 'Regular field title', value: 'Some value here' },
    //     { name: '\u200B', value: '\u200B' },
    //     { name: 'Inline field title', value: 'Some value here', inline: true },
    //     { name: 'Inline field title', value: 'Some value here', inline: true },
    // ]

    // // Function for create dynamic messageEmbed
    // const createMessageWithDecorator = (
    //     color = '#fffff',
    //     title = 'Some title',
    //     url = 'https://dofus.jeuxonline.info/article/14648/taniere-givrefoux',
    //     author = { name: 'Some name', image: 'https://i.imgur.com/wSTFkRM.png', url: 'https://discord.js.org' },
    //     description = 'Some description here',
    //     thumbnail = 'https://i.imgur.com/wSTFkRM.png',
    //     fields = defaultFields,
    //     field = { title: 'Inline field title', value: 'Some value here', flag: true },
    //     image = 'https://i.imgur.com/wSTFkRM.png',
    //     footer = { text: 'Some footer text here', image: 'https://i.imgur.com/wSTFkRM.png' },
    //     ) => {
        
    //     console.log({
    //         color,
    //         title,
    //         url,
    //         author,
    //         description,
    //         thumbnail,
    //         fields,
    //         field,
    //         image,
    //         footer,
    //     }); 

    //     const messageEmbed = new Discord.MessageEmbed()
    //     .setColor(color)
    //     .setTitle(title)
    //     .setURL(url)
    //     .setAuthor(author.name, author.image, author.url)
    //     .setDescription(description)
    //     .setThumbnail(thumbnail)
    //     .addFields(fields)
    //     .addField(field.title, field.value, field.flag)
    //     .setImage(image)
    //     .setTimestamp()
    //     .setFooter(footer.text, footer.image);

    //     return messageEmbed
    // }