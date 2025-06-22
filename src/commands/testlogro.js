import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { LOGROS } from '../utils/achievements.js';
import { generateAchievementImage } from '../utils/achievementImage.js';

const tipos = [
  ['messages', 'Mensajes'],
  ['reactions', 'Reacciones'],
  ['voice', 'Voz'],
  ['birthday', 'Cumpleaños'],
  ['booster', 'Booster']
];

export default {
  data: new SlashCommandBuilder()
    .setName('testlogro')
    .setDescription('Simula el anuncio de un logro (solo admins)')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo de logro')
        .setRequired(true)
        .addChoices(...tipos.map(([v, n]) => ({ name: n, value: v }))))
    .addIntegerOption(option =>
      option.setName('nivel')
        .setDescription('Nivel del logro (0 para el primero)')
        .setRequired(false))
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a mencionar (opcional)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: 'Solo administradores pueden usar este comando.', flags: 64 });
    }
    const tipo = interaction.options.getString('tipo');
    let nivel = interaction.options.getInteger('nivel') ?? 0;
    const user = interaction.options.getUser('usuario') || interaction.user;
    let logro;
    if (tipo === 'birthday' || tipo === 'booster') {
      logro = LOGROS[tipo];
      nivel = 0;
    } else {
      logro = LOGROS[tipo]?.[nivel];
    }
    if (!logro) {
      return interaction.reply({ content: 'Tipo o nivel de logro inválido.', flags: 64 });
    }
    const imgBuffer = await generateAchievementImage({
      type: tipo,
      level: nivel,
      title: logro.title,
      desc: logro.desc || logro.description
    });
    const logrosChannel = interaction.guild.channels.cache.get('1269848036545134654');
    if (logrosChannel) {
      await logrosChannel.send({
        content: `¡Felicidades ${user}! Has desbloqueado un logro.\n¡Consulta tu progreso con /logros!`,
        files: [{ attachment: imgBuffer, name: 'logro.png' }]
      });
      return interaction.reply({ content: 'Mensaje de logro enviado al canal de logros.', flags: 64 });
    } else {
      return interaction.reply({ content: 'No se encontró el canal de logros.', flags: 64 });
    }
  }
};
