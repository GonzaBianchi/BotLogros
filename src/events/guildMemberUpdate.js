import Achievement from '../models/Achievement.js';
import { LOGROS } from '../utils/achievements.js';
import { generateAchievementImage } from '../utils/achievementImage.js';

export default {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    // Solo usuarios reales
    if (newMember.user.bot || newMember.roles.cache.some(r => r.name === 'Bots')) return;
    // Si el usuario ya tenía el logro, no hacer nada
    let achievement = await Achievement.findOne({ userId: newMember.id, guildId: newMember.guild.id });
    if (achievement && achievement.achievements.booster) return;
    // Si el usuario ahora es booster
    if (!oldMember.premiumSince && newMember.premiumSince) {
      if (!achievement) {
        achievement = await Achievement.create({
          userId: newMember.id,
          guildId: newMember.guild.id,
          achievements: { booster: true }
        });
      } else {
        achievement.achievements.booster = true;
        await achievement.save();
      }
      // Anunciar logro
      const logrosChannel = newMember.guild.channels.cache.get('1269848036545134654');
      if (logrosChannel) {
        const imgBuffer = await generateAchievementImage({
          type: 'booster',
          level: 0,
          title: LOGROS.booster.title,
          desc: LOGROS.booster.description
        });
        logrosChannel.send({
          content: `¡Felicidades ${newMember}! Has desbloqueado un logro.\n¡Consulta tu progreso con /logros!`,
          files: [{ attachment: imgBuffer, name: 'logro.png' }]
        });
      }
    }
  }
};
