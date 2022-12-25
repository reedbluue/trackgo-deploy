import { Markup, Scenes } from 'telegraf';
import { CodeValidator } from '../helpers/CodeValidator.js';
import { TrackerHelper } from '../helpers/TrackerHelper.js';
import { TrackService } from '../services/TrackService.js';
export const trackUpdateDescScene = new Scenes.WizardScene('trackUpdateDescScene', async (ctx) => {
    ctx.scene.session.trackID = ctx.trackID;
    await ctx.replyWithHTML(`Tudo bem! 😊\n
Para sair do assistente, basta digitar <code>/sair</code> ou utilizar os botões de navegação do Telegram ^^
        
Digite a nova descrição do Track:`, Markup.keyboard([['/ajuda', '/sair']]));
    ctx.wizard.next();
}, async (ctx) => {
    if (ctx.message.text.length < 3) {
        await ctx.replyWithHTML(`&#x26A0;  <b>Descrição muito curta</b>  &#x26A0;
<i>A descrição precisa ser maior do que 3 caracteres!</i>

Com dificuldade? Digite <code>/ajuda</code>!`);
    }
    else if (ctx.message.text.length > 20) {
        await ctx.replyWithHTML(`&#x26A0;  <b>Descrição muito longa</b>  &#x26A0;
<i>A descrição somente pode ter até 20 caracteres!</i>

Com dificuldade? Digite <code>/ajuda</code>!`);
    }
    else {
        const res = TrackService.atualizarTrack(ctx.scene.session.trackID, {
            description: ctx.message.text,
        });
        if (!res)
            await ctx.replyWithHTML(`Não foi possível atualizar a descrição do Track! 🙁
Tente novamente mais tarde.`);
        await ctx.replyWithHTML(`A descrição do Track foi atualizada com sucesso! 👌`, Markup.removeKeyboard());
        await ctx.scene.leave();
    }
});
trackUpdateDescScene.use(async (ctx, next) => {
    ctx.scene.session.expires = Math.floor(Date.now() / 1000) + 35;
    clearTimeout(ctx.scene.session.inativeUserCallBack);
    ctx.scene.session.inativeUserCallBack = setTimeout(async function () {
        await ctx.reply('Inatividade detectada. Saindo do assistente de edição.', Markup.removeKeyboard());
        await ctx.scene.leave();
    }, 30000);
    next();
});
trackUpdateDescScene.command('ajuda', async (ctx) => {
    await ctx.replyWithHTML(`A descrição da Track, deve conter uma breve descrição do seu pacote, e deve conter de 5 à 20 caractéres!`);
});
trackUpdateDescScene.command('sair', async (ctx) => {
    await ctx.reply('Tudo bem! Saindo do assistente de edição.', Markup.removeKeyboard());
    await ctx.scene.leave();
});
trackUpdateDescScene.leave(async (ctx) => {
    clearTimeout(ctx.scene.session.inativeUserCallBack);
});
export const trackUpdateCodeScene = new Scenes.WizardScene('trackUpdateCodeScene', async (ctx) => {
    ctx.scene.session.trackID = ctx.trackID;
    await ctx.replyWithHTML(`Tudo bem! 😊\n
Para sair do assistente, basta digitar <code>/sair</code> ou utilizar os botões de navegação do Telegram ^^

Digite o novo código do Track:`, Markup.keyboard([['/ajuda', '/sair']]));
    ctx.wizard.next();
}, async (ctx) => {
    if (!CodeValidator.check(ctx.message.text)) {
        await ctx.replyWithHTML(`&#x26A0;  <b>Formato do código inválido!</b>  &#x26A0;
<i>Digite os 13 dígitos no padrão "XX123456789XX"</i>

Com dificuldade? Digite <code>/ajuda</code>!`);
    }
    else {
        if (await TrackService.isDuplicate(ctx.scene.session.code, ctx.scene.session.userID)) {
            await ctx.replyWithHTML(`&#x26A0;  <b>Código da Track já registrada para seu usuário!</b>  &#x26A0;
<i>Por favor, digite um código diferente.</i>

Com dificuldade? Digite <code>/ajuda</code>!`);
        }
        else {
            const rawTrack = await TrackerHelper.returnFrom([ctx.message.text]);
            const res = TrackService.atualizarTrack(ctx.scene.session.trackID, {
                code: ctx.message.text,
                status: rawTrack[0].status || null,
                type: rawTrack[0].type || null,
            });
            if (!res)
                await ctx.replyWithHTML(`Não foi possível atualizar o código do Track! 🙁
        Tente novamente mais tarde.`);
            await ctx.replyWithHTML(`O código do Track foi atualizado com sucesso! 👌`, Markup.removeKeyboard());
            await ctx.scene.leave();
        }
    }
});
trackUpdateCodeScene.use(async (ctx, next) => {
    ctx.scene.session.expires = Math.floor(Date.now() / 1000) + 35;
    clearTimeout(ctx.scene.session.inativeUserCallBack);
    ctx.scene.session.inativeUserCallBack = setTimeout(async function () {
        await ctx.reply('Inatividade detectada. Saindo do assistente de edição.', Markup.removeKeyboard());
        await ctx.scene.leave();
    }, 30000);
    next();
});
trackUpdateCodeScene.command('ajuda', async (ctx) => {
    await ctx.replyWithHTML(`O código de rastreio deve ser no padrão dos CORREIOS BRASIL.
O parão é composto por duas letras, seguidas por nove números e, por fim, mais duas letras.`);
});
trackUpdateCodeScene.command('sair', async (ctx) => {
    await ctx.reply('Tudo bem! Saindo do assistente de edição.', Markup.removeKeyboard());
    await ctx.scene.leave();
});
trackUpdateCodeScene.leave(async (ctx) => {
    clearTimeout(ctx.scene.session.inativeUserCallBack);
});
