import { TokenService } from '../services/TokenService.js';
import { UserSessionService } from '../services/UserSessionService.js';
export class AdminController {
    static geraToken = async (ctx) => {
        const token = await TokenService.generateKey();
        return await ctx.replyWithHTML(`<code>${token}</code>`);
    };
    static resetaTokens = async (_ctx) => {
        await TokenService.resetAllSessions();
    };
    static resetaSessions = async (_ctx) => {
        await UserSessionService.resetAllSessions();
    };
}
