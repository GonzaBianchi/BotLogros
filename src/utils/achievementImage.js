import { createCanvas } from 'canvas';

const COLORS = [
  '#A9A9A9', // Hierro
  '#CD7F32', // Bronce
  '#C0C0C0', // Plata
  '#FFD700', // Oro
  '#00BFFF', // Platino
  '#50C878', // Esmeralda
  '#B9F2FF'  // Diamante
];

const EMOJIS = {
  messages: '💬',
  reactions: '👍',
  voice: '🔊',
  birthday: '🎂',
  booster: '🚀'
};

export async function generateAchievementImage({ type, level, title, desc }) {
  const width = 500;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  // Borde de color según nivel
  ctx.strokeStyle = COLORS[level] || COLORS[0];
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, width - 6, height - 6);

  // Emoji grande
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(EMOJIS[type] || '🏆', 30, 80);

  // "¡LOGRO DESBLOQUEADO!"
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#39FF90';
  ctx.fillText('¡LOGRO DESBLOQUEADO!', 100, 40);

  // Título
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(title, 100, 80);

  // Descripción
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#b9bbbe';
  ctx.fillText(desc, 100, 110);

  return canvas.toBuffer('image/png');
}
