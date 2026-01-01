import { Interaction, MessageFlags, TextChannel, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, GuildMember } from 'discord.js';
import commands from '../handlers/commandHandler';
import Config from '../config';
import logger from '../utils/logger';

export const onInteraction = async (interaction: Interaction) => {
  // Buttons
  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      const modal = new ModalBuilder()
        .setCustomId('verify_modal')
        .setTitle('Verify Yourself');

      const firstName = new TextInputBuilder()
        .setCustomId('first_name')
        .setLabel('Characters first name:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
      
      const lastName = new TextInputBuilder()
        .setCustomId('last_name')
        .setLabel('Characters last name:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const steamName = new TextInputBuilder()
        .setCustomId('steam_name')
        .setLabel('Steam Name:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(firstName),
        new ActionRowBuilder<TextInputBuilder>().addComponents(lastName),
        new ActionRowBuilder<TextInputBuilder>().addComponents(steamName)
      )

      await interaction.showModal(modal);
      return;
    } 
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'verify_modal') {
      const firstName = interaction.fields.getTextInputValue('first_name');
      const lastName = interaction.fields.getTextInputValue('last_name');
      const steamName = interaction.fields.getTextInputValue('steam_name');

      const newNickname = `${firstName} ${lastName} (${steamName})`;

      try {
        const member = interaction.member as GuildMember;
        await member.setNickname(newNickname, 'User verified themselves via modal');

        await member.roles.add(Config.VERIFIED_ROLE)

        await interaction.reply({
          content: `You have been given access to the discord, welcome ${firstName}!`,
          flags: MessageFlags.Ephemeral
        })
      } catch(error) {
        await interaction.reply({
          content: 'There was an error setting your nickname. Please contact a developer or staff member',
          flags: MessageFlags.Ephemeral
        })
      }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (interaction.commandName === 'kick' || interaction.commandName === 'bulkunban') {
      const logChannel = interaction.guild?.channels.cache.get(Config.ACTION_LOG_CHANNEL) as TextChannel;
      logChannel && logChannel.send(`${interaction.user.tag} used **${interaction.commandName}**!`);
    }

    if (typeof command.run === 'function') {
      await command.run(interaction);
    }
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction
        .reply({
          content: 'There was an error executing that command.',
          flags: MessageFlags.Ephemeral,
        })
        .catch((err) => {
          logger.error('Error sending error response:', err);
        });
    } else if (interaction.deferred) {
      await interaction
        .editReply({
          content: 'There was an error executing that command.',
        })
        .catch((err) => {
          logger.error('Error editing error response:', err);
        });
    }
  }
};
