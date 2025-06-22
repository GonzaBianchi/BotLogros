import { SlashCommandBuilder } from 'discord.js';
import Birthday from '../models/Birthday.js';

export default {
  data: new SlashCommandBuilder()
    .setName('deletebirthday')
    .setDescription('Borra tu cumpleaños guardado'),
  async execute(interaction) {
    // Producción: solo canal específico, Test: cualquier canal
    const prodServer = '752883098059800647';
    const prodChannel = '1269848036545134654';
    const testServer = '1374115839715835934';
    if (
      (interaction.guildId === prodServer && interaction.channelId !== prodChannel) // Solo canal específico en prod
    ) {
      return interaction.reply({ content: 'Este comando solo se puede usar en el canal autorizado.', flags: 64 });
    }
    // En test server, cualquier canal
    const deleted = await Birthday.findOneAndDelete({ userId: interaction.user.id, guildId: interaction.guildId });
    if (!deleted) {
      return interaction.reply({ content: 'No tenías cumpleaños guardado.', flags: 64 });
    }
    return interaction.reply({ content: '¡Cumpleaños borrado!', flags: 64 });
  }
};
