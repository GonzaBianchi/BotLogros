import { SlashCommandBuilder } from 'discord.js';
import Birthday from '../models/Birthday.js';

export default {
  data: new SlashCommandBuilder()
    .setName('editbirthday')
    .setDescription('Edita tu cumpleaños (formato: DD-MM)')
    .addStringOption(option =>
      option.setName('fecha')
        .setDescription('Nuevo cumpleaños (DD-MM)')
        .setRequired(true)),
  async execute(interaction) {
    const prodServer = '752883098059800647';
    const prodChannel = '1269848036545134654';
    const testServer = '1374115839715835934';
    if (
      (interaction.guildId === prodServer && interaction.channelId !== prodChannel)
    ) {
      return interaction.reply({ content: 'Este comando solo se puede usar en el canal autorizado.', flags: 64 });
    }
    // En test server, cualquier canal
    const fecha = interaction.options.getString('fecha');
    if (!/^\d{2}-\d{2}$/.test(fecha)) {
      return interaction.reply({ content: 'Formato inválido. Usa DD-MM.', flags: 64 });
    }
    const updated = await Birthday.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guildId },
      { birthday: fecha }
    );
    if (!updated) {
      return interaction.reply({ content: 'No tenías cumpleaños seteado. Usa /setbirthday primero.', flags: 64 });
    }
    return interaction.reply({ content: `¡Cumpleaños actualizado a ${fecha}!`, flags: 64 });
  }
};
