import { startDbConnection } from './configs/dbConfig.js';
import bot from './services/BotService.js';
import dotenv from 'dotenv';
import { server } from './configs/aliveServer.js';
dotenv.config();
const { PORT } = process.env;
server.listen(PORT || 3000);
await startDbConnection();
await bot.launch();
