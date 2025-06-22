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
    }
    await achievement.save();
  }
};
