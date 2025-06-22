import { SlashCommandBuilder } from 'discord.js';
import Achievement from '../models/Achievement.js';
import { LOGROS, LEVELS } from '../utils/achievements.js';

function getProgress(ach, type) {
  if (type === 'birthday' || type === 'booster') {
    return ach.achievements[type] ? 1 : 0;
  }
  if (type === 'messages' || type === 'reactions' || type === 'voice') {
    const levels = LEVELS[type];
    const value = ach.achievements[type] || 0;
    let level = 0;
    for (let i = 0; i < levels.length; i++) {
      if (value >= levels[i]) level = i + 1;
    }
    return level / levels.length;
  }
  return 0;
}

export default {
  data: new SlashCommandBuilder()
    .setName('logros')
    .setDescription('Muestra tu progreso de logros o el de otro usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a consultar')
        .setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const user = interaction.options.getUser('usuario') || interaction.user;
      const ach = await Achievement.findOne({ userId: user.id, guildId: interaction.guildId });
      if (!ach) {
        return interaction.editReply({ content: `${user} aún no tiene logros registrados.` });
      }
      let total = 0;
      let completados = 0;
      let desc = '';
      // Cumpleaños
      total++;
      if (ach.achievements.birthday) completados++;
      desc += `🎂 Cumpleaños: ${ach.achievements.birthday ? '✅' : '❌'}\n`;
      // Booster
      total++;
      if (ach.achievements.booster) completados++;
      desc += `🚀 Booster: ${ach.achievements.booster ? '✅' : '❌'}\n`;
      // Mensajes
      total += LEVELS.messages.length;
      let msgLevel = ach.achievements.messagesLevel || 0;
      completados += msgLevel;
      desc += `💬 Mensajes: ${msgLevel}/${LEVELS.messages.length} (${ach.achievements.messages || 0} enviados)\n`;
      // Reacciones
      total += LEVELS.reactions.length;
      let reactLevel = ach.achievements.reactionsLevel || 0;
      completados += reactLevel;
      desc += `👍 Reacciones: ${reactLevel}/${LEVELS.reactions.length} (${ach.achievements.reactions || 0} agregadas)\n`;
      // Voice
      total += LEVELS.voice.length;
      let voiceLevel = ach.achievements.voiceLevel || 0;
      completados += voiceLevel;
      desc += `🔊 Voz: ${voiceLevel}/${LEVELS.voice.length} (${ach.achievements.voiceMinutes || 0} min)\n`;
      // Porcentaje
      const porcentaje = ((completados / total) * 100).toFixed(1);
      desc += `\nProgreso total: **${porcentaje}%**`;
      return interaction.editReply({ content: `Progreso de logros de ${user} :\n${desc}` });
    } catch (err) {
      console.error('Error en logros:', err);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: 'Ocurrió un error al consultar los logros. Intenta de nuevo más tarde.' });
      } else {
        await interaction.reply({ content: 'Ocurrió un error al consultar los logros. Intenta de nuevo más tarde.' });
      }
    }
  }
};
