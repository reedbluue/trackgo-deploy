import { session } from 'telegraf';
import { userValidation } from '../middlewares/userValidation.js';
import { wizardStage } from '../scenes/index.js';
import adminRouter from './adminRouter.js';
export const routes = (bot) => {
    bot.use(adminRouter);
    bot.use(session());
    bot.use(wizardStage.middleware());
    bot.use(userValidation);
    return;
};
