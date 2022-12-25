import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { BotConnectionError } from '../errors/botErrors.js';
import { routes } from '../routes/index.js';
import { updateAndNotify } from '../intervals/updateAndNotify.js';
dotenv.config();
const { BOT_API_TOKEN, TRACK_UPDATE_DELAY } = process.env;
if (!BOT_API_TOKEN)
    throw new BotConnectionError('Bot Token inválido!');
const bot = new Telegraf(BOT_API_TOKEN);
routes(bot);
setTimeout(async () => {
    await updateAndNotify();
}, 10000);
setInterval(async () => {
    await updateAndNotify();
}, Number(TRACK_UPDATE_DELAY) * 1000);
export default bot;
