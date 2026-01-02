import { 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    ChatInputCommandInteraction, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle 
} from "discord.js";
import { Command } from "../../interfaces/command";
import { ReactionRoles } from "../../constants";

const ReactRole: Command = {
    data: new SlashCommandBuilder()
        .setName('react-role')
        .setDescription('Sends a reaction role embed')
        .addChannelOption((option) => 
            option.setName('channel').setDescription('The channel to send the embed in').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async run(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel', true);
        if (!interaction.guild) return;

        const embed = new EmbedBuilder()
            .setTitle('Get your Roles')
            .setDescription('Press one of the buttons below to recieve a role!')
            .setColor('#8c5bfa')
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() || undefined });
        
        const rows: ActionRowBuilder<ButtonBuilder>[] = [];
        let currentRow = new ActionRowBuilder<ButtonBuilder>();

        ReactionRoles.forEach((role) => {
            const button = new ButtonBuilder()
                .setCustomId(`reactrole_${role.roleId}`)
                .setLabel(role.label)
                .setStyle(ButtonStyle.Primary);

            currentRow.addComponents(button);

            if ((currentRow.components as any).length === 5) {
                rows.push(currentRow);
                currentRow = new ActionRowBuilder<ButtonBuilder>();
            }
        });

        if ((currentRow.components as any).length > 0) rows.push(currentRow);

        await channel.send({ embeds: [embed], components: rows });
    }
}

export default ReactRole;