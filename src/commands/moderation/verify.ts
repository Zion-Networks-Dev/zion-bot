import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, EmbedBuilder, TextChannel } from 'discord.js'
import { Command } from '../../interfaces/command';

const Verify: Command = {
    data: new SlashCommandBuilder()
        .setName('verify-modal')
        .setDescription('Sends the verification modal to a chosen channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('channel').setDescription('The channel to send the modal in').setRequired(true)
            
        ),

    async run(interaction: CommandInteraction) {
        const channel = interaction.options.getChannel('channel');
        if (!interaction.guild || !channel?.isTextBased()) return;

        const embed = new EmbedBuilder()
            .setTitle('Verify Yourself')
            .setDescription('Click the button below to verify yourself and change your name')
            .setColor('#8c5bfa')
            .setTimestamp()
            .setFooter({ text: 'Zion Networks', iconURL: interaction.guild.iconURL()});

        await (channel as TextChannel).send({ embeds: [embed] });

        await interaction.reply({content: `Verification model sent in channel: ${channel}`, ephemeral: true})
    }
}

export default Verify;