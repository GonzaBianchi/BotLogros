import Achievement from '../models/Achievement.js';
import { LOGROS, LEVELS } from '../utils/achievements.js';

const userReactedMessages = new Map(); // userId: Set(messageId)

export default {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    if (user.bot) return;
    const member = reaction.message.guild?.members.cache.get(user.id);
    if (!member || member.roles.cache.some(r => r.name === 'Bots')) return;
    if (!reaction.message.guild) return;

    // Solo contar una reacción por mensaje por usuario
    const key = `${user.id}:${reaction.message.id}`;
    if (userReactedMessages.has(key)) return;
    userReactedMessages.set(key, true);

    let achievement = await Achievement.findOne({ userId: user.id, guildId: reaction.message.guild.id });
    if (!achievement) {
      achievement = await Achievement.create({
        userId: user.id,
        guildId: reaction.message.guild.id,
        achievements: {}
      });
    }
    achievement.achievements.reactions = (achievement.achievements.reactions || 0) + 1;

    // Revisar si sube de nivel
    const currentLevel = achievement.achievements.reactionsLevel || 0;
    const nextLevel = currentLevel < LEVELS.reactions.length ? LEVELS.reactions[currentLevel] : null;
    if (nextLevel && achievement.achievements.reactions >= nextLevel) {
      achievement.achievements.reactionsLevel = currentLevel + 1;
      // Anunciar logro
      const logro = LOGROS.reactions[currentLevel];
      const logrosChannel = reaction.message.guild.channels.cache.get('1269848036545134654');
      if (logrosChannel) {
        logrosChannel.send({
          content: `**${logro.title}**\n<@${user.id}> ${logro.desc}\n¡Consulta tu progreso con /logros!`
        });
      }
    }
    await achievement.save();
  }
};
