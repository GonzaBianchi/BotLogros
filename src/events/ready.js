import Birthday from '../models/Birthday.js';
import { ChannelType } from 'discord.js';

// IDs de canales y servidores permitidos
const BIRTHDAY_CHANNELS = {
  '752883098059800647': '752883098059800650', // Producción: canal de felicitaciones
  '1374115839715835934': null // Test: no enviar felicitaciones automáticas
};

export default {
  name: 'ready',
  async execute(client) {
    setInterval(async () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const todayStr = `${day}-${month}`;
      const birthdays = await Birthday.find({ birthday: todayStr });
      for (const b of birthdays) {
        const guild = client.guilds.cache.get(b.guildId);
        if (!guild) continue;
        const channelId = BIRTHDAY_CHANNELS[b.guildId];
        if (!channelId) continue;
        const channel = guild.channels.cache.get(channelId);
        if (!channel || channel.type !== ChannelType.GuildText) continue;
        channel.send({
          content: `¡Feliz cumpleaños <@${b.userId}>! 🥳🎂\n\n¡Espero que tengas un día tan especial como tú! (al estilo Tony Tony Chopper 🦌💙)`
        });
      }
    }, 1000 * 60 * 60); // cada hora
  }
};
