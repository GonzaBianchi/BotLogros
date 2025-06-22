import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import mongoose from 'mongoose';
import express from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Express health check
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dynamic event handler loader
const eventsPath = path.join(__dirname, 'events');
for (const file of readdirSync(eventsPath)) {
  if (file.endsWith('.js')) {
    const event = await import(`./events/${file}`);
    if (event.default?.name && typeof event.default.execute === 'function') {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    } else if (event.name && typeof event.execute === 'function') {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

// Dynamic command loader (slash commands)
const commandsPath = path.join(__dirname, 'commands');
for (const file of readdirSync(commandsPath)) {
  if (file.endsWith('.js')) {
    const command = await import(`./commands/${file}`);
    if (command.default?.data && command.default?.execute) {
      client.commands.set(command.default.data.name, command.default);
    } else if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Deploy slash commands on startup
const commands = [];
for (const file of readdirSync(commandsPath)) {
  if (file.endsWith('.js')) {
    const command = await import(`./commands/${file}`);
    if (command.default?.data) {
      commands.push(command.default.data.toJSON());
    } else if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
}
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const servers = [
  '752883098059800647', // Producción
  '1374115839715835934' // Test
];
(async () => {
  try {
    for (const guildId of servers) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: commands }
      );
      console.log(`Comandos registrados en el servidor ${guildId}`);
    }
  } catch (error) {
    console.error(error);
  }
})();

// Global error handlers para debug en Render y local
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

client.on('error', (err) => {
  console.error('CLIENT ERROR:', err);
});

client.on('shardError', (err) => {
  console.error('SHARD ERROR:', err);
});

client.login(process.env.TOKEN);
