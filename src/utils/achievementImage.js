import { createCanvas, registerFont } from 'canvas';

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

  // Título (sin emoji, texto más pequeño y ajuste si es largo)
  let cleanTitle = title.replace(/^[^a-zA-Z0-9]+\s*/, ''); // Quita emoji inicial si lo hay
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = COLORS[level] || COLORS[0];
  let maxTitleWidth = 370;
  if (ctx.measureText(cleanTitle).width > maxTitleWidth) {
    // Reduce el tamaño si es muy largo
    ctx.font = 'bold 18px sans-serif';
  }
  ctx.fillText(cleanTitle, 110, 80, maxTitleWidth);

  // Descripción (texto más pequeño y ajuste si es largo)
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#b9bbbe';
  let maxDescWidth = 370;
  // Si la descripción es muy larga, la partea en varias líneas
  let words = desc.split(' ');
  let line = '';
  let y = 110;
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxDescWidth && n > 0) {
      ctx.fillText(line, 110, y, maxDescWidth);
      line = words[n] + ' ';
      y += 20;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 110, y, maxDescWidth);

  return canvas.toBuffer('image/png');
}

// Genera una imagen con barras de progreso para todos los logros y el total
export async function generateProgressImage(ach, LEVELS) {
  const width = 520;
  const height = 270;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  const barX = 40;
  let barY = 40;
  const barWidth = 400;
  const barHeight = 22;
  const gap = 38;

  // Datos de progreso
  const tipos = [
    { key: 'birthday', label: 'Cumpleaños', icon: '🎂', max: 1, value: ach.achievements.birthday ? 1 : 0 },
    { key: 'booster', label: 'Booster', icon: '🚀', max: 1, value: ach.achievements.booster ? 1 : 0 },
    { key: 'messages', label: 'Mensajes', icon: '💬', max: LEVELS.messages.length, value: ach.achievements.messagesLevel || 0 },
    { key: 'reactions', label: 'Reacciones', icon: '👍', max: LEVELS.reactions.length, value: ach.achievements.reactionsLevel || 0 },
    { key: 'voice', label: 'Voz', icon: '🔊', max: LEVELS.voice.length, value: ach.achievements.voiceLevel || 0 }
  ];
  let total = 0, completados = 0;

  // Título
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#39FF90';
  ctx.fillText('Progreso de logros', 30, 28);

  for (const tipo of tipos) {
    // Etiqueta
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#b9bbbe';
    ctx.fillText(`${tipo.icon} ${tipo.label}`, barX, barY + 16);
    // Barra
    ctx.fillStyle = '#444';
    ctx.fillRect(barX + 120, barY, barWidth, barHeight);
    ctx.fillStyle = '#39FF90';
    const percent = tipo.value / tipo.max;
    ctx.fillRect(barX + 120, barY, barWidth * percent, barHeight);
    // Texto de progreso
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${tipo.value}/${tipo.max}`, barX + 530 - 60, barY + 16);
    barY += gap;
    total += tipo.max;
    completados += tipo.value;
  }
  // Barra total
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#b9bbbe';
  ctx.fillText('Total', barX, barY + 16);
  ctx.fillStyle = '#444';
  ctx.fillRect(barX + 120, barY, barWidth, barHeight);
  ctx.fillStyle = '#FFD700';
  const percentTotal = completados / total;
  ctx.fillRect(barX + 120, barY, barWidth * percentTotal, barHeight);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${completados}/${total}`, barX + 530 - 60, barY + 16);

  return canvas.toBuffer('image/png');
}

// Genera una barra de progreso horizontal bonita
export function drawProgressBar(ctx, x, y, width, height, percent, color='#39FF90', bgColor='#444', borderColor='#23272A', showPercent=true) {
  // Fondo
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);
  // Progreso
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * percent, height);
  // Borde
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  // Porcentaje
  if (showPercent) {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percent*100)}%`, x + width/2, y + height/2);
  }
}

// Genera una imagen para el embed de logros con barra total y barras de cada tipo
export async function generateLogrosEmbedImage(ach, LEVELS, LOGROS) {
  const width = 600;
  const height = 320;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  // Progreso total
  const tipos = [
    { key: 'birthday', label: 'Cumpleaños', max: 1, value: ach.achievements.birthday ? 1 : 0 },
    { key: 'booster', label: 'Booster', max: 1, value: ach.achievements.booster ? 1 : 0 },
    { key: 'messages', label: 'Mensajes', max: LEVELS.messages.length, value: ach.achievements.messagesLevel || 0 },
    { key: 'reactions', label: 'Reacciones', max: LEVELS.reactions.length, value: ach.achievements.reactionsLevel || 0 },
    { key: 'voice', label: 'Voz', max: LEVELS.voice.length, value: ach.achievements.voiceLevel || 0 }
  ];
  let total = 0, completados = 0;
  for (const t of tipos) { total += t.max; completados += t.value; }
  const percentTotal = completados / total;

  // Título
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#39FF90';
  ctx.fillText('Progreso total de logros', 30, 40);

  // Barra total
  drawProgressBar(ctx, 30, 60, 540, 28, percentTotal, '#FFD700');
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${completados}/${total} logros`, 300, 105);

  // Barras individuales
  let barY = 140;
  for (const tipo of tipos) {
    let percent = tipo.value / tipo.max;
    let color = tipo.key === 'birthday' ? '#50C878' : tipo.key === 'booster' ? '#00BFFF' : '#39FF90';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#b9bbbe';
    ctx.fillText(tipo.label, 30, barY + 18);
    drawProgressBar(ctx, 160, barY, 410, 22, percent, color);
    barY += 40;
  }
  return canvas.toBuffer('image/png');
}
