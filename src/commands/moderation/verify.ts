import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, EmbedBuilder, TextChannel, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { Command } from '../../interfaces/command';

const Verify: Command = {
    data: new SlashCommandBuilder()
        .setName('verify-modal')
        .setDescription('Sends the verification modal to a chosen channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('channel')
                  .setDescription('The channel to send the modal in')
                  .setRequired(true)
        ),

    async run(interaction: CommandInteraction) {
        const channelOption = interaction.options.get('channel');
        if (!channelOption || !interaction.guild) return;

        const channel = channelOption.channel;
        if (!channel || channel.type !== ChannelType.GuildText) return;

        const embed = new EmbedBuilder()
            .setTitle('Verify Yourself')
            .setDescription('Click the button below to verify yourself and change your name')
            .setColor('#8c5bfa')
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() ?? undefined });

        const button = new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await (channel as TextChannel).send({ embeds: [embed], components: [row] });

        await interaction.reply({ content: `Verification modal sent in ${channel}`, ephemeral: true });
        return;
    }
}

export default Verify;
