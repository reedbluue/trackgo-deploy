import { Composer, Markup } from 'telegraf';
import { AdminController } from '../controllers/AdminController.js';
import { adminValidation } from '../middlewares/adminValidation.js';
const adminRouter = new Composer();
adminRouter.command('admin', adminValidation, (ctx) => {
    ctx.replyWithHTML(`<b>Comandos administrativos:</b>`, Markup.inlineKeyboard([
        Markup.button.callback(`📩 Convidar`, 'inviteToken'),
        Markup.button.callback(`📨 Excluir convites`, 'resetTokens'),
        Markup.button.callback(`🔄 Resetar sessões`, 'resetSessions'),
    ]));
});
adminRouter.action('inviteToken', async (ctx) => {
    await ctx.answerCbQuery('Convite gerado com sucesso ✅', {});
    await AdminController.geraToken(ctx);
});
adminRouter.action('resetTokens', async (ctx) => {
    await ctx.answerCbQuery('Convites deletados com suceeso ✅', {});
    await AdminController.resetaTokens(ctx);
});
adminRouter.action('resetSessions', async (ctx) => {
    await ctx.answerCbQuery('Sessões resetadas com sucesso ✅', {});
    await AdminController.resetaSessions(ctx);
});
export default adminRouter;
