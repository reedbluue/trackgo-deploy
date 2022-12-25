import { Markup, Scenes } from 'telegraf';
import { TrackService } from '../services/TrackService.js';
import { UserService } from '../services/UserService.js';
import { DateTime } from 'luxon';
export const userScene = new Scenes.WizardScene('userScene', async (ctx) => {
    ctx.botInfo;
});
userScene.enter(async (ctx, next) => {
    ctx.scene.session.userID = ctx.userID;
    await ctx.telegram.setMyCommands([
        { command: '/listar', description: 'Retornar todos os seus Tracks.' },
        { command: '/adicionar', description: 'Adicione um novo Track.' },
        { command: '/ajuda', description: 'Conheça mais sobre o TrackGo!' },
        { command: '/sobre', description: 'Conheça mais sobre o TrackGo!' },
    ]);
    next();
});
userScene.start(async (ctx) => {
    await ctx.replyWithHTML(`<b>Bem-Vindo(a) ao TrackBot, ${ctx.from.first_name}! 😁</b>

Descubra os recursos disponíveis com: <code>/ajuda</code>`);
});
userScene.command('ajuda', async (ctx, _) => {
    await ctx.replyWithHTML(`<b>Comandos disponíveis:</b>
<code>/adicionar</code> - Adicione novos Tracks 📝
<code>/listar</code> - Lista todos os seus Tracks 🗃️
    `);
});
userScene.command('adicionar', async (ctx, _) => {
    ctx.userID = ctx.scene.session.userID;
    await ctx.scene.enter('trackCreateScene');
});
userScene.command('listar', async (ctx) => {
    const user = await UserService.buscaPorTelegramId(ctx.from.id.toString());
    if (!user)
        return;
    const tracks = await TrackService.listarTodos(user._id);
    if (!tracks.length) {
        await ctx.replyWithHTML(`<b>Você não possui Tracks! 🙁</b>
Adicione um novo com o comando: <code>/adicionar</code>`);
    }
    else {
        await ctx.replyWithHTML(`📋 <b>Tracks cadastrados:</b>`, Markup.inlineKeyboard(tracks.map((track) => Markup.button.callback(`${track.status?.length
            ? _statusIndicator(track.status[track.status.length - 1])
            : `❌`} ⠀ > ⠀ ${track.description.toUpperCase()}`, `desc-${track.id}`)), { columns: 1 }));
    }
});
userScene.command('sobre', async (ctx, _) => {
    await ctx.replyWithHTML(`<b>Sobre o TrackGo v2.0.0 📦</b>

TrackGo é um projeto simples, em desenvolvimento, feito para solucionar uma demanda pessoal para rastreio de encomendas do Correios Brasil.
Em suas versões mais novas, é capaz de atender a uma demanda maior de usuários e com funcionalidades focadas na experiência dos mesmos!

Conheça mais sobre o TrackGo Bot em <a href="https://github.com/reedbluue/trackgo">nosso repositório no GitHub</a> 😊

Projeto por <a href="https://github.com/reedbluue">@Igor Oliveira</a> 🙋🏾‍♂️`, { disable_web_page_preview: true });
});
userScene.action(/^desc-(.*)$/, async (ctx) => {
    const trackId = ctx.match[1];
    const track = (await TrackService.listar(trackId))[0];
    if (!track)
        return await ctx.answerCbQuery('O Track não existe mais! ❌', {});
    await ctx.answerCbQuery('', {});
    if (track.status?.length) {
        return await ctx.replyWithHTML(`➡️ <b>${track.description.toUpperCase()}</b>
${track.code.toUpperCase()}
${`${track.type}`}

${_statusIndicator(track.status[track.status.length - 1])} Status atual:\n${track.status[track.status.length - 1].description}`, Markup.inlineKeyboard([
            Markup.button.callback('📃 Rastreio Completo', `fullDesc-${trackId}`),
            Markup.button.callback('📝 Editar', `edit-${trackId}`),
            Markup.button.callback('🗑️ Deletar', `del-${trackId}`),
        ]));
    }
    else {
        return await ctx.replyWithHTML(`<b>${track.description.toUpperCase()}</b>

❌ Rastreio não existente!

${track.code.toUpperCase()}`, Markup.inlineKeyboard([
            Markup.button.callback('📝 Editar', `edit-${trackId}`),
            Markup.button.callback('🗑️ Deletar', `del-${trackId}`),
        ]));
    }
});
userScene.action(/^fullDesc-(.*)$/, async (ctx) => {
    const trackId = ctx.match[1];
    const track = (await TrackService.listar(trackId))[0];
    if (!track)
        return await ctx.answerCbQuery('O Track não existe mais! ❌', {});
    await ctx.answerCbQuery('', {});
    const allStatus = track.status;
    if (!allStatus || !allStatus.length)
        return;
    return await ctx.replyWithHTML(`📃 <b>Histórico de rastreio:</b>
${track.code}

${allStatus
        .map((status) => {
        return `${!status.unity
            ? ''
            : `${!status.unity.type
                ? ``
                : `${status.unity.type === 'País'
                    ? `EXTERIOR 🌎`
                    : `${status.unity.city} / ${status.unity.state.toUpperCase()} 📍`}`}
${status.description} ${_statusIndicator(status)}`}
${status.dateTime
            ? `${DateTime.fromJSDate(status.dateTime)
                .setLocale('pt-br')
                .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)} 🗓️`
            : ``}
${!status.unity
            ? ``
            : `Local: ${!status.unity.type
                ? `Desconhecido 🌐`
                : `${status.unity.type === 'País'
                    ? `País de Origem 📌`
                    : `${status.unity.type} - ${status.unity.city} / ${status.unity.state.toUpperCase()} 📌`}`}`}
${!status.destiny
            ? ``
            : `Destino: ${!status.destiny.type
                ? `Desconhecido 🌐`
                : `${status.destiny.type === 'País'
                    ? `País de Origem 📌`
                    : `${status.destiny.type} - ${status.destiny.city} / ${status.destiny.state.toUpperCase()} 🛫`}`}`}\n`;
    })
        .map((field) => field.trimEnd())
        .join('\n\n')}`);
});
const _statusIndicator = (status) => {
    if (!status)
        return '❌';
    switch (status.code) {
        case 'BDE':
            return '🏁';
        case 'OEC':
            return '🏠';
        case 'PAR':
            return '🇧🇷';
        case 'RO':
            return '🚚';
        case 'DO':
            return '🚚';
        case 'LDI':
            return '⏳';
        case 'BDI':
            return '⌛';
        case 'PO':
            return '📦';
        default:
            return '📦';
    }
};
userScene.action(/^del-(.*)$/, async (ctx) => {
    const trackId = ctx.match[1];
    const isOk = await TrackService.deletar(trackId);
    if (!isOk)
        return await ctx.answerCbQuery('O Track não existe mais! ❌', {});
    return await ctx.answerCbQuery('Track deletada ✅', {});
});
userScene.action(/^edit-(.*)$/, async (ctx) => {
    const trackId = ctx.match[1];
    const track = (await TrackService.listar(trackId))[0];
    if (!track)
        return await ctx.answerCbQuery('O Track não existe mais! ❌', {});
    await ctx.answerCbQuery('', {});
    return await ctx.replyWithHTML(`O que você gostaria de editar?`, Markup.inlineKeyboard([
        Markup.button.callback('Descrição', `editDesc-${trackId}`),
        Markup.button.callback('Código', `editCode-${trackId}`),
    ]));
});
userScene.action(/^editDesc-(.*)$/, async (ctx) => {
    const trackId = ctx.match[1];
    const track = (await TrackService.listar(trackId))[0];
    if (!track)
        return await ctx.answerCbQuery('O Track não existe mais! ❌', {});
    await ctx.answerCbQuery('', {});
    ctx.trackID = trackId;
    return ctx.scene.enter('trackUpdateDescScene');
});
userScene.action(/^editCode-(.*)$/, async (ctx) => {
    const trackId = ctx.match[1];
    const track = (await TrackService.listar(trackId))[0];
    if (!track)
        return await ctx.answerCbQuery('O Track não existe mais! ❌', {});
    await ctx.answerCbQuery('', {});
    ctx.trackID = trackId;
    return ctx.scene.enter('trackUpdateCodeScene');
});
