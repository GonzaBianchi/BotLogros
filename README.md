# Bot de Discord: Sistema de Logros

Este bot utiliza discord.js, mongoose y express para gestionar logros, hitos y cumpleaños de los usuarios.

## Estructura
- `src/commands`: Comandos del bot (incluyendo slash commands)
- `src/events`: Listeners de eventos de Discord
- `src/models`: Esquemas de Mongoose para MongoDB
- `src/utils`: Utilidades varias
- `src/app.js`: Entrada principal del bot

## Configuración
1. Crea un archivo `.env` con tu `MONGO_URI` y `TOKEN` de Discord.
2. Instala las dependencias:
   ```sh
   npm install discord.js mongoose express dotenv
   ```
3. Ejecuta el bot:
   ```sh
   node src/app.js
   ```

## Despliegue
Listo para Render.com (usa Express para mantener el bot activo).
