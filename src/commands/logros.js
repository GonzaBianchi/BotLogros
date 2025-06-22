import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Achievement from '../models/Achievement.js';
import { LOGROS, LEVELS } from '../utils/achievements.js';
import { generateLogrosEmbedImage } from '../utils/achievementImage.js';

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
      // Calcular totales
      const tipos = [
        { key: 'birthday', label: 'Cumpleaños', max: 1, value: ach.achievements.birthday ? 1 : 0 },
        { key: 'booster', label: 'Booster', max: 1, value: ach.achievements.booster ? 1 : 0 },
        { key: 'messages', label: 'Mensajes', max: LEVELS.messages.length, value: ach.achievements.messagesLevel || 0 },
        { key: 'reactions', label: 'Reacciones', max: LEVELS.reactions.length, value: ach.achievements.reactionsLevel || 0 },
        { key: 'voice', label: 'Voz', max: LEVELS.voice.length, value: ach.achievements.voiceLevel || 0 }
      ];
      let total = 0, completados = 0;
      for (const t of tipos) { total += t.max; completados += t.value; }
      // Imagen de barras
      const imgBuffer = await generateLogrosEmbedImage(ach, LEVELS, LOGROS);
      // Embed
      const embed = new EmbedBuilder()
        .setTitle(`Logros de ${user.username}`)
        .setColor('#39FF90')
        .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 256 }))
        .setDescription(`Completaste **${completados}** de **${total}** logros totales.`)
        .setImage('attachment://progreso.png');
      // Agregar campos para cada tipo de logro
      for (const tipo of tipos) {
        let progreso = `${tipo.value}/${tipo.max}`;
        let nextTitle = '';
        if (tipo.key === 'birthday' || tipo.key === 'booster') {
          nextTitle = LOGROS[tipo.key].title;
        } else {
          const nivel = ach.achievements[`${tipo.key}Level`] || 0;
          if (nivel < LOGROS[tipo.key].length) {
            nextTitle = LOGROS[tipo.key][nivel].title;
          } else {
            nextTitle = LOGROS[tipo.key][LOGROS[tipo.key].length-1].title;
          }
        }
        embed.addFields({
          name: `${tipo.label} (${progreso})`,
          value: `Siguiente: **${nextTitle}**`,
          inline: false
        });
      }
      return interaction.editReply({ embeds: [embed], files: [{ attachment: imgBuffer, name: 'progreso.png' }] });
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
