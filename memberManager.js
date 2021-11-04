const {  MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const ms = require('ms');

const warns = require("./warns.json");

const defaultTimeMute = '30s';

const mute = async (interaction, memberPermissions) => {
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
}

const unmute = async (interaction, memberPermissions) => {
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

}

const warn = async (interaction, memberPermissions) => {
    const reason = interaction.options.getString('reason');

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
}

const kick = async (interaction, memberPermissions) => {
    const reason = interaction.options.getString('reason');

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
}

const ban = async (interaction, memberPermissions) => {
    const reason = interaction.options.getString('reason');

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

module.exports = {
    mute,
    unmute,
    warn,
    kick,
    ban,
}