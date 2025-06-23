import { SlashCommandBuilder } from 'discord.js';
import Achievement from '../models/Achievement.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sincronizarboosters')
    .setDescription('Otorga el logro de booster a todos los que ya tienen el rol de booster (admin)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: 'Solo administradores pueden usar este comando.', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: true });
    const boosterRoleId = '1216095868365705317';
    const guild = interaction.guild;
    const boosterRole = guild.roles.cache.get(boosterRoleId);
    if (!boosterRole) return interaction.editReply('No se encontró el rol de booster.');
    let count = 0;
    for (const member of boosterRole.members.values()) {
      let ach = await Achievement.findOneAndUpdate(
        { userId: member.id, guildId: guild.id },
        { $setOnInsert: { userId: member.id, guildId: guild.id, achievements: {} } },
        { upsert: true, new: true }
      );
      if (!ach.achievements.booster) {
        ach.achievements.booster = true;
        await ach.save();
        count++;
        // Anunciar logro retroactivo
        const { LOGROS } = await import('../utils/achievements.js');
        const { generateAchievementImage } = await import('../utils/achievementImage.js');
        const logrosChannel = guild.channels.cache.get('1269848036545134654');
        if (logrosChannel) {
          const imgBuffer = await generateAchievementImage({
            type: 'booster',
            level: 0,
            title: LOGROS.booster.title,
            desc: LOGROS.booster.description
          });
          await logrosChannel.send({
            content: `¡Felicidades <@${member.id}>! Has recibido el logro de booster retroactivamente.\n¡Consulta tu progreso con /logros!`,
            files: [{ attachment: imgBuffer, name: 'logro.png' }]
          });
        }
      }
    }
    return interaction.editReply(`Se otorgó el logro de booster a ${count} usuarios retroactivamente.`);
  }
};
