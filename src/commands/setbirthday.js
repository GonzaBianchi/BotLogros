import { SlashCommandBuilder } from 'discord.js';
import Birthday from '../models/Birthday.js';
import Achievement from '../models/Achievement.js';

const LOGRO_CUMPLE = {
  title: '¡Logro desbloqueado: Cumpleañero! 🎉',
  description: 'Registró su cumpleaños en el bot.'
};

export default {
  data: new SlashCommandBuilder()
    .setName('setbirthday')
    .setDescription('Setea tu cumpleaños (formato: DD-MM)')
    .addStringOption(option =>
      option.setName('fecha')
        .setDescription('Tu cumpleaños (DD-MM)')
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
    await Birthday.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guildId },
      { birthday: fecha },
      { upsert: true }
    );
    // Logro de cumpleaños
    let achievement = await Achievement.findOne({ userId: interaction.user.id, guildId: interaction.guildId });
    let firstTime = false;
    if (!achievement) {
      achievement = await Achievement.create({
        userId: interaction.user.id,
        guildId: interaction.guildId,
        achievements: { birthday: true }
      });
      firstTime = true;
    } else if (!achievement.achievements.birthday) {
      achievement.achievements.birthday = true;
      await achievement.save();
      firstTime = true;
    }
    // Anunciar logro en canal de logros (solo si es la primera vez)
    if (firstTime && interaction.guildId === prodServer) {
      const channel = interaction.guild.channels.cache.get(prodChannel);
      if (channel) {
        channel.send({
          content: `**${LOGRO_CUMPLE.title}**\n${interaction.user} ${LOGRO_CUMPLE.description}\n¡Consulta tu progreso con </logros:${interaction.commandId}>!`
        });
      }
    }
    return interaction.reply({ content: `¡Cumpleaños seteado para el ${fecha}!`, flags: 64 });
  }
};
