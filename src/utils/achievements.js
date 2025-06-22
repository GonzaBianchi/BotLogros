// Títulos y descripciones de logros para cada tipo y nivel
export const LOGROS = {
  birthday: {
    title: '¡Cumpleañero Oficial!',
    description: 'Registró su cumpleaños en el bot. ¡Que empiecen los festejos!'
  },
  booster: {
    title: '¡Turbo Fan del Server!',
    description: 'Ha boosteado el servidor y lo llevó a otro nivel.'
  },
  messages: [
    { title: '¡Primeras Palabras!', desc: 'Envió 20 mensajes. ¡Ya rompiste el hielo!' },
    { title: '¡Conversador Casual!', desc: 'Envió 100 mensajes. ¡Te gusta charlar!' },
    { title: '¡Chateador Constante!', desc: 'Envió 500 mensajes. ¡No paras de escribir!' },
    { title: '¡Teclado Humeante!', desc: 'Envió 1,000 mensajes. ¡Tus dedos no descansan!' },
    { title: '¡Leyenda del Chat!', desc: 'Envió 10,000 mensajes. ¡Eres historia viva del server!' },
    { title: '¡Mito del Teclado!', desc: 'Envió 100,000 mensajes. ¡Nadie te detiene!' },
    { title: '¡Deidad del Spam!', desc: 'Envió 1,000,000 mensajes. ¡Eres omnipresente!' }
  ],
  reactions: [
    { title: '¡Dedo Inquieto!', desc: 'Agregó 10 reacciones. ¡Empieza el apoyo!' },
    { title: '¡Reaccionador Alegre!', desc: 'Agregó 100 reacciones. ¡Te gusta expresarte!' },
    { title: '¡Emoji Master!', desc: 'Agregó 500 reacciones. ¡Dominas los emojis!' },
    { title: '¡Señor de las Reacciones!', desc: 'Agregó 1,000 reacciones. ¡Tus reacciones son leyenda!' },
    { title: '¡Rey del Like!', desc: 'Agregó 10,000 reacciones. ¡Eres el pulgar del server!' },
    { title: '¡Mito de las Reacciones!', desc: 'Agregó 100,000 reacciones. ¡Tus emojis son eternos!' },
    { title: '¡Dios de los Emojis!', desc: 'Agregó 1,000,000 reacciones. ¡Eres la reacción encarnada!' }
  ],
  voice: [
    { title: '¡Charlatán Novato!', desc: 'Pasó 60 minutos en voz. ¡Ya rompiste el silencio!' },
    { title: '¡Conversador de Café!', desc: 'Pasó 180 minutos en voz. ¡Te gusta hablar!' },
    { title: '¡Locutor Amateur!', desc: 'Pasó 720 minutos en voz. ¡Tu voz es conocida!' },
    { title: '¡Radio del Server!', desc: 'Pasó 1,440 minutos en voz. ¡Eres la voz del pueblo!' },
    { title: '¡Leyenda del Mic!', desc: 'Pasó 1 semana en voz. ¡No te callas nunca!' },
    { title: '¡Mito del Parlante!', desc: 'Pasó 1 mes en voz. ¡Eres el eco eterno!' }
  ]
};

// Niveles de cada logro (acumulativos)
export const LEVELS = {
  messages: [20, 100, 500, 1000, 10000, 100000, 1000000],
  reactions: [10, 100, 500, 1000, 10000, 100000, 1000000],
  voice: [60, 180, 720, 1440, 10080, 43200] // minutos
};
