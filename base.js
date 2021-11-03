require('dotenv').config()

const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
// const discordParser = require('discord-command-parser');
// const tools = require('./scapperTools');



const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.js');
const { selectMenuRow, buttonMessage, embedMessage } = require('./utils.js');

const warns = require("./warns.json");
const fs = require('fs');
const ms = require('ms');
// Require the necessary discord.js classes
// const { token } = require('./config.json');

const defaultTimeMute = '30s';

// Create a new client instance
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_BANS, 
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
    ],
    // partials: ["MESSAGE", "USER", "REACTION"] 
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);



const commands = [
	new SlashCommandBuilder().setName('vote').setDescription('Vote take two params'),
	new SlashCommandBuilder().setName('ping')
    .setDescription('Replies with pong!')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addStringOption(option => option.setName('time').setDescription('Enter a string like 10s or 1h'))
        .addStringOption(option => option.setName('reason').setDescription('Explaint your reason my son')),
        // .addIntegerOption(option => option.setName('int').setDescription('Enter an integer'))
        // .addNumberOption(option => option.setName('num').setDescription('Enter a number'))
        // .addBooleanOption(option => option.setName('choice').setDescription('Select a boolean'))
        // .addChannelOption(option => option.setName('destination').setDescription('Select a channel'))
        // .addRoleOption(option => option.setName('muted').setDescription('Select a role'))
        // .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something')),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        // if (!interaction.isButton()) return;
        const { commandName, memberPermissions } = interaction;
    console.log(interaction)
        if (commandName === 'ping') {
            const reason = interaction.options.getString('reason');
            let time = interaction.options.getString('time');
            // const integer = interaction.options.getInteger('int');
            // const number = interaction.options.getNumber('num');
            // const boolean = interaction.options.getBoolean('choice');
            // const user = interaction.options.getUser('target');
            // const member = interaction.options.getMember('target');
            // const channel = interaction.options.getChannel('destination');
            // const role = interaction.options.getRole('muted');
            // const mentionable = interaction.options.getMentionable('mentionable');

            // console.log([string, integer, boolean, user, member, channel, role, mentionable]);
            

            if (!memberPermissions.has(Permissions.FLAGS.MUTE_MEMBERS))
                return interaction.reply("You do not have permission to do that.");
            const user = interaction.options.getUser('target');
            console.log({user});

            if (!user)
                return interaction.reply("Please specify someone you want to mute. **!mute <user> [time] [reason]**");
            const target = interaction.member.guild.members.cache.get(user.id);

            if (!time)
                time = defaultTimeMute;
                console.log(target.guild.voiceStates.cache)
                const memberVoiceState = target.guild.voiceStates.cache.get(target.id);
                console.log({memberVoiceState})
                await memberVoiceState.setMute(true, reason)

            const embed = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been muted by ${interaction.user.username} for ${ms(ms(time))}.\nReason: **${reason != "" ? reason : "-"}**`);

            interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                await memberVoiceState.setMute(false, reason)
                const unmute = new MessageEmbed()
                    .setColor("#00aaaa")
                    .setDescription(`${user} has been unmuted.`);
                interaction.deferReply({ embeds: [unmute] });
            }, ms(time));


            // [-----------------------------------------------------]
            // const selectedMenu = selectMenuRow()
            // const objEmbed = embedMessage({})
            // const objEmbed2 = embedMessage({})
            // const buttonActionTest1 = buttonMessage({customId: 'test1', label: 'test1'})
            // const buttonActionTest2 = buttonMessage({customId: 'test2', label: 'test2'})
            // const allComponants = [
            //     selectedMenu,
            //     buttonActionTest1,
            //     buttonActionTest2,
            // ]
            // const allEmbeds = [
            //     objEmbed,
            // ]

            // await interaction.reply({ content: 'Ping-Content', ephemeral: true, embeds: [...allEmbeds], components: [...allComponants] });
            
        } else if (commandName === 'server') {
            await interaction.reply('Server info.');
        } else if (commandName === 'user') {
            await interaction.reply('User info.');
        } else if (commandName === 'vote') {

            await interaction.reply('Vote Test');
        }

        
    });

    client.on('interactionCreate', interaction => {
        if (!interaction.isButton()) return;
        console.log(interaction);
        if (interaction.message.content === 'Ping-Content') {
            if (interaction.customId === 'test1') {
                console.log('interaction.member;;', interaction.member.guild.members.guild.bans);
                
                interaction.reply('Test1 is Selected');
            } else if (interaction.customId === 'test2') {
                interaction.reply('Test2 is Selected');
            }
        }
    });

    client.on('interactionCreate', interaction => {
        if (!interaction.isSelectMenu()) return;
        // console.log('interaction.member;;', interaction.member.guild.members);
    });

const manageMembers = async (message) => {
    const isBotDirectMessageType = message.author.bot || message.channel.type === 'dm';
    if (isBotDirectMessageType)
        return;
    let prefix = '!';
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    //Your muted role id goes here.
    //You should deny the "SEND_MESSAGES" permission for this role.
    const mutedroleid = (message.guild.roles.cache.find(role => role.name === "Moderator")).id;
    console.log(mutedroleid);
    const mutedrole = message.guild.roles.cache.get(mutedroleid);

    //BAN COMMAND
    //!ban @Member reason
    if (cmd === `${prefix}ban`) {
        if (!message.member.permissions.has("BAN_MEMBERS"))
            return message.reply("You do not have permission to do that.");
        const user = message.mentions.users.first();
        if (!user)
            return message.reply("Please specify someone you want to ban. **!ban <user> [reason]**");
        if (user.id === message.author.id)
            return message.reply("You cannot ban yourself.");
        const reason = args.slice(1).join(" ");
        message.guild.members.cache.get(user.id).ban({ reason: reason });

        const banmessage = new MessageEmbed()
            .setColor("#00aaaa")
            .setDescription(`${user} has been banned. Reason: **${reason != "" ? reason : "-"}**`);
        message.channel.send({ embeds: [banmessage] });
    }

    //KICK COMMAND
    //!kick @Member reason
    if (cmd === `${prefix}kick`) {
        if (!message.member.permissions.has("KICK_MEMBERS"))
            return message.reply("You do not have permission to do that.");
        const user = message.mentions.users.first();
        if (!user)
            return message.reply("Please specify someone you want to kick. **!kick <user> [reason]**");
        if (user.id === message.author.id)
            return message.reply("You cannot kick yourself.");
        const reason = args.slice(1).join(" ");
        message.guild.members.cache.get(user.id).kick(reason);

        const kickmessage = new MessageEmbed()
            .setColor("#00aaaa")
            .setDescription(`${user} has been kicked. Reason: **${reason != "" ? reason : "-"}**`);
        message.channel.send({ embeds: [kickmessage] });
    }

    //MUTE COMMAND
    //!mute @Member time(s, m, d, h) reason
    if (cmd === `${prefix}mute`) {

        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
            return message.reply("You do not have permission to do that.");
        const user = message.mentions.users.first();
        if (!user)
            return message.reply("Please specify someone you want to mute. **!mute <user> [time] [reason]**");
        const target = message.guild.members.cache.get(user.id);

        const reason = args.slice(2).join(" ");
        let time = args[1];
        if (!time)
            time = defaultTimeMute;

        const memberVoiceState = target.guild.voiceStates.cache.get(user.id)
        await memberVoiceState.setMute(true, reason)

        const embed = new MessageEmbed()
            .setColor("#00aaaa")
            .setDescription(`${user} has been muted by ${message.author} for ${ms(ms(time))}.\nReason: **${reason != "" ? reason : "-"}**`);

        message.channel.send({ embeds: [embed] });

        setTimeout(async () => {
            await memberVoiceState.setMute(false, reason)
            const unmute = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been unmuted.`);
            message.channel.send({ embeds: [unmute] });
        }, ms(time));
    }

    //UNMUTE COMMAND
    //!unmute @Member reason
    if (cmd === `${prefix}unmute`) {
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
            return message.reply("You do not have permission to do that.");
        const user = message.mentions.users.first();
        if (!user)
            return message.reply("Please specify someone you want to unmute. **!unmute <user> [reason]**");
        const target = message.guild.members.cache.get(user.id);

        const reason = args.slice(1).join(" ");

        const memberVoiceState = target.guild.voiceStates.cache.get(user.id)
        await memberVoiceState.setMute(false, reason)

        const unmute = new MessageEmbed()
            .setColor("#00aaaa")
            .setDescription(`${user} has been unmuted by ${message.author}.\nReason: **${reason != "" ? reason : "-"}**`);
        message.channel.send({ embeds: [unmute] });
    }

    //WARN COMMAND
    //!warn @Member reason
    if (cmd === `${prefix}warn`) {
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
            return message.reply("You do not have permission to do that.");
        const user = message.mentions.users.first();
        if (!user)
            return message.reply("Please specify someone you want to warn. **!warn <user> [reason]**");
        const target = message.guild.members.cache.get(user.id);

        const reason = args.slice(1).join(" ");

        if (!warns[user.id]) {
            warns[user.id] = {
                warnCount: 1
            };
        } else {
            warns[user.id].warnCount += 1;
        }

        if (warns[user.id].warnCount >= 3) {
            const mute = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been muted. (**3**/**3**)\nReason: **${reason != "" ? reason : "-"}**`);
            message.channel.send({ embeds: [mute] });

            const memberVoiceState = target.guild.voiceStates.cache.get(user.id)
            await memberVoiceState.setMute(true, reason)
            warns[user.id].warnCount = 0;

            setTimeout(async () => {
                await memberVoiceState.setMute(false, reason)
                const unmute = new MessageEmbed()
                    .setColor("#00aaaa")
                    .setDescription(`${user} has been unmuted.`);
                message.channel.send({ embeds: [unmute] });
            }, ms(defaultTimeMute));

        } else {
            const warn = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been warned by ${message.author}. (**${warns[user.id].warnCount}**/**3**) \nReason: **${reason != "" ? reason : "-"}**`);
            message.channel.send({ embeds: [warn] });
        }

        fs.writeFile("./warns.json", JSON.stringify(warns), err => {
            if (err)
                console.log(err);
        });

    }

};

// client.on('messageCreate', manageMembers);