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
	new SlashCommandBuilder().setName('mute')
        .setDescription('Mute a target')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addStringOption(option => option.setName('time').setDescription('Enter a string like 10s or 1h'))
        .addStringOption(option => option.setName('reason').setDescription('Explaint your reason my son')),

	new SlashCommandBuilder().setName('unmute')
        .setDescription('Unmute a target')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason').setDescription('Explaint your reason my son')),

	new SlashCommandBuilder().setName('warn')
        .setDescription('Set a warning for target')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason').setDescription('Explaint your reason my son')),

    new SlashCommandBuilder().setName('kick')
        .setDescription('Set a warning for target')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason').setDescription('Explaint your reason my son')),

    new SlashCommandBuilder().setName('ban')
        .setDescription('Set a warning for target')
        .addUserOption(option => option.setName('target').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason').setDescription('Explaint your reason my son')),

].map(command => command.toJSON());

// const integer = interaction.options.getInteger('int');
// const number = interaction.options.getNumber('num');
// const boolean = interaction.options.getBoolean('choice');
// const user = interaction.options.getUser('target');
// const member = interaction.options.getMember('target');
// const channel = interaction.options.getChannel('destination');
// const role = interaction.options.getRole('muted');
// const mentionable = interaction.options.getMentionable('mentionable');

// console.log([string, integer, boolean, user, member, channel, role, mentionable]);

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const { commandName, memberPermissions } = interaction;
        if (commandName === 'mute') {
            const reason = interaction.options.getString('reason');
            let time = interaction.options.getString('time');

            if (!memberPermissions.has(Permissions.FLAGS.MUTE_MEMBERS))
                return interaction.reply("You do not have permission to do that.");
            const user = interaction.options.getUser('target');

            if (!user)
                return interaction.reply("Please specify someone you want to mute. **!mute <user> [time] [reason]**");
            const target = interaction.member.guild.members.cache.get(user.id);

            if (!time)
                time = defaultTimeMute;
                const memberVoiceState = target.guild.voiceStates.cache.get(target.id);
                await memberVoiceState.setMute(true, reason)

            const embed = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been muted by @${interaction.user.username} for ${ms(ms(time))}.\nReason: **${reason != "" ? reason : "-"}**`);

            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                await memberVoiceState.setMute(false, reason)
                const unmute = new MessageEmbed()
                    .setColor("#00aaaa")
                    .setDescription(`${user} has been unmuted.`);
                await interaction.followUp({ embeds: [unmute] });
            }, ms(time));

        } else if (commandName === 'unmute') {
            const reason = interaction.options.getString('reason');

            if (!memberPermissions.has(Permissions.FLAGS.MUTE_MEMBERS))
                return interaction.reply("You do not have permission to do that.");
            const user = interaction.options.getUser('target');
            if (!user)
                return interaction.reply("Please specify someone you want to unmute. **!unmute <user> [reason]**");
            const target = interaction.member.guild.members.cache.get(user.id);

            const memberVoiceState = target.guild.voiceStates.cache.get(target.id);
                await memberVoiceState.setMute(true, reason)

            const unmute = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been unmuted by @${interaction.user.username}.\nReason: **${reason != "" ? reason : "-"}**`);
                await interaction.reply({ embeds: [unmute] });
        
        } else if (commandName === 'warn') {

            if (!memberPermissions.has(Permissions.FLAGS.MUTE_MEMBERS))
                return interaction.reply("You do not have permission to do that.");
            const user = interaction.options.getUser('target');
            if (!user)
                return interaction.reply("Please specify someone you want to warn. **!warn <user> [reason]**");
            const target = interaction.member.guild.members.cache.get(user.id);

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
                await interaction.reply({ embeds: [mute] });

                const memberVoiceState = target.guild.voiceStates.cache.get(user.id)
                await memberVoiceState.setMute(true, reason)
                warns[user.id].warnCount = 0;

                setTimeout(async () => {
                    await memberVoiceState.setMute(false, reason)
                    const unmute = new MessageEmbed()
                        .setColor("#00aaaa")
                        .setDescription(`${user} has been unmuted.`);
                    await interaction.followUp({ embeds: [unmute] });
                }, ms(defaultTimeMute));

            } else {
                const warn = new MessageEmbed()
                    .setColor("#00aaaa")
                    .setDescription(`${user} has been warned by @${interaction.user.username}. (**${warns[user.id].warnCount}**/**3**) \nReason: **${reason != "" ? reason : "-"}**`);
                await interaction.reply({ embeds: [warn] });
            }

            fs.writeFile("./warns.json", JSON.stringify(warns), err => {
                if (err)
                    console.log(err);
            });

        } else if (commandName === 'kick') {

            if (!memberPermissions.has("KICK_MEMBERS"))
                return interaction.reply("You do not have permission to do that.");
            const user = interaction.options.getUser('target');
            if (!user)
                return interaction.reply("Please specify someone you want to kick. **!kick <user> [reason]**");
            if (user.id === interaction.user.id)
                return interaction.reply("You cannot kick yourself.");

            await interaction.member.guild.members.cache.get(user.id).kick(reason);

            const kickmessage = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been kicked. Reason: **${reason != "" ? reason : "-"}**`);
            await interaction.reply({ embeds: [kickmessage] });

        } else if (commandName === 'ban') {

            if (!memberPermissions.has("BAN_MEMBERS"))
                return interaction.reply("You do not have permission to do that.");
            const user = interaction.options.getUser('target');
            if (!user)
                return interaction.reply("Please specify someone you want to ban. **!ban <user> [reason]**");
            if (user.id === interaction.user.id)
                return interaction.reply("You cannot ban yourself.");

            await interaction.member.guild.members.cache.get(user.id).ban({ reason: reason });

            const banmessage = new MessageEmbed()
                .setColor("#00aaaa")
                .setDescription(`${user} has been banned. Reason: **${reason != "" ? reason : "-"}**`);
            await interaction.reply({ embeds: [banmessage] });
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
