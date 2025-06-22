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

  // Cuadrado con puntas redondeadas y número de logro
  const squareX = 30;
  const squareY = 40;
  const squareSize = 60;
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(squareX + radius, squareY);
  ctx.lineTo(squareX + squareSize - radius, squareY);
  ctx.quadraticCurveTo(squareX + squareSize, squareY, squareX + squareSize, squareY + radius);
  ctx.lineTo(squareX + squareSize, squareY + squareSize - radius);
  ctx.quadraticCurveTo(squareX + squareSize, squareY + squareSize, squareX + squareSize - radius, squareY + squareSize);
  ctx.lineTo(squareX + radius, squareY + squareSize);
  ctx.quadraticCurveTo(squareX, squareY + squareSize, squareX, squareY + squareSize - radius);
  ctx.lineTo(squareX, squareY + radius);
  ctx.quadraticCurveTo(squareX, squareY, squareX + radius, squareY);
  ctx.closePath();
  ctx.fillStyle = COLORS[level] || COLORS[0];
  ctx.fill();

  // Número de logro dentro del cuadrado
  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = '#23272A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((level + 1).toString(), squareX + squareSize / 2, squareY + squareSize / 2);

  // "¡LOGRO DESBLOQUEADO!"
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#39FF90';
  ctx.fillText('¡LOGRO DESBLOQUEADO!', 110, 40);

  // Título con color de material según nivel
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = COLORS[level] || COLORS[0];
  ctx.fillText(title, 110, 80);

  // Descripción
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#b9bbbe';
  ctx.fillText(desc, 110, 110);

  return canvas.toBuffer('image/png');
}
