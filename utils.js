const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const seedOption = [
    {
        label: 'Select me',
        description: 'This is a description',
        value: 'first_option',
    },
    {
        label: 'You can select me too',
        description: 'This is also a description',
        value: 'second_option',
    },
]
const selectMenuRow = (customId, placeholder, options = seedOption) => {

    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId(customId || 'select')
            .setPlaceholder(placeholder || 'Nothing selected')
            .addOptions(options),
    );
    return row;
}

const buttonMessage = ({ customId, label, style, isDisabled }) => {

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(customId || 'primary')
            .setLabel(label || 'Primary')
            .setStyle(style || 'PRIMARY')
            .setDisabled(isDisabled || false),
            // .setEmoji('123456789012345678')
    );

    return row;
}

const embedMessage = ({ color, title, url, description }) => {
    const embed = new MessageEmbed()
    .setColor(color || '#0099ff')
    .setTitle(title || 'Some title')
    .setURL(url || 'https://discord.js.org')
    .setDescription(description || 'Some description here');
    return embed
}

// DateTime Utils
const DateTime = require('luxon').DateTime;
const { log } = require('console');

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


module.exports = {
    selectMenuRow,
    buttonMessage,
    embedMessage,
    dateTools,
}