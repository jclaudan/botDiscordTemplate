require('dotenv').config()

const { Client, Intents } = require('discord.js');
// const discordParser = require('discord-command-parser');
// const tools = require('./scapperTools');



const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.js');
const { selectMenuRow, buttonMessage, embedMessage } = require('./utils.js');
const { mute, unmute, warn, kick, ban } = require('./memberManager.js');

// Require the necessary discord.js classes
// const { token } = require('./config.json');

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

const reasonDescription = 'set the reason level with min 0 and max 5';

const commands = [
	new SlashCommandBuilder().setName('mute')
        .setDescription('Mute a target')
        .addUserOption(option => option.setName('t').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason')
            .setDescription(reasonDescription)
            .addChoice('Level 0', 'Level 0')
			.addChoice('Level 1', 'Level 1')
			.addChoice('Level 2', 'Level 2')
        ),
        // .addStringOption(option => option.setName('time').setDescription('Enter a string like 10s or 1h')),

	new SlashCommandBuilder().setName('unmute')
        .setDescription('Unmute a target')
        .addUserOption(option => option.setName('t').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason').setDescription(reasonDescription)),

	new SlashCommandBuilder().setName('warn')
        .setDescription('Set a warning for target')
        .addUserOption(option => option.setName('t').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason')
            .setDescription(reasonDescription)
            .addChoice('Level 0', 'Level 0')
			.addChoice('Level 1', 'Level 1')
			.addChoice('Level 2', 'Level 2')
        ),
    new SlashCommandBuilder().setName('kick')
        .setDescription('Set a warning for target')
        .addUserOption(option => option.setName('t').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason')
            .setDescription(reasonDescription)
            .addChoice('Level 0', 'Level 0')
			.addChoice('Level 1', 'Level 1')
			.addChoice('Level 2', 'Level 2')
        ),
    new SlashCommandBuilder().setName('ban')
        .setDescription('Set a warning for target')
        .addUserOption(option => option.setName('t').setDescription('Select a user'))
        .addStringOption(option => option.setName('reason')
            .setDescription(reasonDescription)
            .addChoice('Level 0', 'Level 0')
			.addChoice('Level 1', 'Level 1')
			.addChoice('Level 2', 'Level 2')
        ),
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

    const defaultTimeMute = '30s';

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const { commandName, memberPermissions } = interaction;
        if (commandName === 'mute') {
            await mute(interaction, memberPermissions)
        } else if (commandName === 'unmute') {
            await unmute(interaction, memberPermissions)
        } else if (commandName === 'warn') {
           await warn(interaction, memberPermissions)
        } else if (commandName === 'kick') {
            await kick(interaction, memberPermissions)
        } else if (commandName === 'ban') {
            await ban(interaction, memberPermissions)
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
