import { TokenService } from '../services/TokenService.js';
import { UserService } from '../services/UserService.js';
import { UserSessionService } from '../services/UserSessionService.js';
export class RegistrationController {
    static signIn = async (ctx) => {
        const telegramId = ctx.from.id.toString();
        if ((await UserSessionService.checkSession(telegramId)) ||
            (await UserService.buscaPorTelegramId(telegramId)))
            return ctx.reply('Você já é um usuário cadastrado! 😅');
        const token = ctx.message.text.split(' ', 2)[1];
        if (!token)
            return;
        if (!(await TokenService.validateKey(token)))
            return ctx.replyWithHTML(`<b>Convite inválido ou expirado</b> ❌
Verifique o token e tente novamente.`);
        const userRegistered = await UserService.adicionar({
            name: ctx.from.first_name,
            telegramId: telegramId,
            lastName: ctx.from.last_name,
            chatId: ctx.chat.id,
        });
        await UserSessionService.addSession(userRegistered);
        await ctx.replyWithHTML(`<b>Parabéns, ${userRegistered.name}!</b> 🥳
Seu registro foi feito com sucesso!

Para informações de como utilizar o TrackGo, utilize o comando: <code>/ajuda</code>`);
        return await ctx.scene.enter('userScene');
    };
}
