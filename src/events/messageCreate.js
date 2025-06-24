import Achievement from '../models/Achievement.js';
import { LOGROS, LEVELS } from '../utils/achievements.js';
import { generateAchievementImage } from '../utils/achievementImage.js';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    // Ignorar bots y miembros con rol "Bots"
    if (message.author.bot) return;
    const member = message.guild?.members.cache.get(message.author.id);
    if (!member || member.roles.cache.some(r => r.name === 'Bots')) return;

    // Solo contar mensajes en servidores
    if (!message.guild) return;

    // Buscar o crear registro de logros de forma atómica
    let achievement = await Achievement.findOneAndUpdate(
      { userId: message.author.id, guildId: message.guild.id },
      { $setOnInsert: { userId: message.author.id, guildId: message.guild.id, achievements: {} } },
      { upsert: true, new: true }
    );
    // Sumar mensaje
    achievement.achievements.messages = (achievement.achievements.messages || 0) + 1;

    // Revisar si sube de nivel
    const currentLevel = achievement.achievements.messagesLevel || 0;
    const nextLevel = currentLevel < LEVELS.messages.length ? LEVELS.messages[currentLevel] : null;
    if (nextLevel && achievement.achievements.messages >= nextLevel) {
      achievement.achievements.messagesLevel = currentLevel + 1;
      // Anunciar logro
      const logro = LOGROS.messages[currentLevel];
      const logrosChannel = message.guild.channels.cache.get('1269848036545134654');
      if (logrosChannel) {
        const imgBuffer = await generateAchievementImage({
          type: 'messages',
          level: currentLevel,
          title: logro.title,
          desc: logro.desc
        });
        logrosChannel.send({
          content: `¡Felicidades ${message.author}! Has desbloqueado un logro.\n¡Consulta tu progreso con /logros!`,
          files: [{ attachment: imgBuffer, name: 'logro.png' }]
        });
      }
      // --- Rol por máximo nivel de mensajes ---
      if (achievement.achievements.messagesLevel === LEVELS.messages.length) {
        const maxMsgRole = message.guild.roles.cache.get('1387090067738071080');
        const member = message.guild.members.cache.get(message.author.id);
        if (maxMsgRole && member && !member.roles.cache.has(maxMsgRole.id)) {
          await member.roles.add(maxMsgRole, 'Alcanzó el máximo logro de mensajes');
        }
      }
    }
    // --- FELICITACIÓN POR 100% DE LOGROS ---
    const achData = achievement.achievements;
    const allCompleted = achData.birthday && achData.booster &&
      (achData.messagesLevel >= LEVELS.messages.length) &&
      (achData.reactionsLevel >= LEVELS.reactions.length) &&
      (achData.voiceLevel >= LEVELS.voice.length);
    if (allCompleted) {
      const already = await Achievement.countDocuments({
        'achievements.birthday': true,
        'achievements.booster': true,
        'achievements.messagesLevel': { $gte: LEVELS.messages.length },
        'achievements.reactionsLevel': { $gte: LEVELS.reactions.length },
        'achievements.voiceLevel': { $gte: LEVELS.voice.length }
      });
      if (already === 1) {
        const premioChannel = message.guild.channels.cache.get('752883098059800650');
        if (premioChannel) {
          await premioChannel.send({
            content: `🎉 ¡<@${message.author.id}> es la PRIMERA persona en completar el 100% de TODOS los logros!\nPor favor, ve al canal <#1382508364772151349> para reclamar tu premio. <@&1386701159279890584>`
          });
        }
        // Dar rol especial
        const role = message.guild.roles.cache.get('1386701159279890584');
        const member = message.guild.members.cache.get(message.author.id);
        if (role && member && !member.roles.cache.has(role.id)) {
          await member.roles.add(role, 'Completó todos los logros');
        }
      }
    }
    await achievement.save();
  }
};
