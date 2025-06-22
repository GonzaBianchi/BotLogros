import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Achievement from '../models/Achievement.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resetlogros')
    .setDescription('Resetea todos los logros de todos los usuarios (solo admins)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: 'Solo administradores pueden usar este comando.', flags: 64 });
    }
    try {
      await Achievement.deleteMany({ guildId: interaction.guildId });
      return interaction.reply({ content: 'Todos los logros han sido reseteados para este servidor.', flags: 64 });
    } catch (err) {
      console.error('Error en resetlogros:', err);
      return interaction.reply({ content: 'Ocurrió un error al resetear los logros. Intenta de nuevo más tarde.', flags: 64 });
    }
  }
};
