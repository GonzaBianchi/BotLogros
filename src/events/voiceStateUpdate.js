import Achievement from '../models/Achievement.js';
import { LOGROS, LEVELS } from '../utils/achievements.js';
import { generateAchievementImage } from '../utils/achievementImage.js';

const voiceStates = new Map(); // userId: { joinTimestamp, channelId }

export default {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const user = newState.member?.user;
    if (!user || user.bot) return;
    const member = newState.guild.members.cache.get(user.id);
    if (!member || member.roles.cache.some(r => r.name === 'Bots')) return;

    // Entró a un canal de voz
    if (!oldState.channelId && newState.channelId) {
      voiceStates.set(user.id, { joinTimestamp: Date.now(), channelId: newState.channelId });
    }
    // Salió de un canal de voz
    else if (oldState.channelId && !newState.channelId) {
      const session = voiceStates.get(user.id);
      if (session) {
        const minutes = Math.floor((Date.now() - session.joinTimestamp) / 60000);
        let achievement = await Achievement.findOneAndUpdate(
          { userId: user.id, guildId: newState.guild.id },
          { $setOnInsert: { userId: user.id, guildId: newState.guild.id, achievements: { voiceMinutes: 0 } } },
          { upsert: true, new: true }
        );
        achievement.achievements.voiceMinutes = (achievement.achievements.voiceMinutes || 0) + minutes;
        // Revisar si sube de nivel
        const currentLevel = achievement.achievements.voiceLevel || 0;
        const nextLevel = currentLevel < LEVELS.voice.length ? LEVELS.voice[currentLevel] : null;
        if (nextLevel && achievement.achievements.voiceMinutes >= nextLevel) {
          achievement.achievements.voiceLevel = currentLevel + 1;
          // Anunciar logro
          const logro = LOGROS.voice[currentLevel];
          const logrosChannel = newState.guild.channels.cache.get('1269848036545134654');
          if (logrosChannel) {
            const imgBuffer = await generateAchievementImage({
              type: 'voice',
              level: currentLevel,
              title: logro.title,
              desc: logro.desc
            });
            logrosChannel.send({
              content: `¡Felicidades <@${user.id}>! Has desbloqueado un logro.\n¡Consulta tu progreso con /logros!`,
              files: [{ attachment: imgBuffer, name: 'logro.png' }]
            });
          }
        }
        await achievement.save();
        voiceStates.delete(user.id);
      }
    }
  }
};
