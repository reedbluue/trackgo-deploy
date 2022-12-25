import { Scenes } from 'telegraf';
import registrationRouter from '../routes/registrationRouter.js';
export const guestScene = new Scenes.WizardScene('guestScene', async (ctx) => {
    ctx.botInfo;
});
guestScene.use(registrationRouter);
guestScene.enter(async (ctx, next) => {
    await ctx.telegram.setMyCommands([
        { command: '/entrar', description: 'Registre-se com um token.' },
        { command: '/sobre', description: 'Conheça mais sobre o TrackGo!' },
    ]);
    next();
});
guestScene.start(async (ctx, _) => {
    await ctx.replyWithHTML(`<b>Você está no modo visitante 🕵</b>

Para utilizar o TrackBot, você precisa estar registrado. Caso tenha um convite, insira o token utilizando o comando:

<code>/entrar "SEU_TOKEN_AQUI"</code>`);
});
guestScene.command('sobre', async (ctx, _) => {
    await ctx.replyWithHTML(`<b>Sobre o TrackGo v2.0.0 📦</b>

TrackGo é um projeto simples, em desenvolvimento, feito para solucionar uma demanda pessoal para rastreio de encomendas do Correios Brasil.
Em suas versões mais novas, é capaz de atender a uma demanda maior de usuários e com funcionalidades focadas na experiência dos mesmos!

Conheça mais sobre o TrackGo Bot em <a href="https://github.com/reedbluue/trackgo">nosso repositório no GitHub</a> 😊

Projeto por <a href="https://github.com/reedbluue">@Igor Oliveira</a> 🙋🏾‍♂️`, { disable_web_page_preview: true });
});
