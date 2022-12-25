import { TrackService } from '../services/TrackService.js';
import bot from '../services/BotService.js';
import { Schema } from 'mongoose';
import { DateTime } from 'luxon';
export const updateAndNotify = async () => {
    const tracks = await TrackService.atualizarTodasAsTracks();
    for (const track of tracks) {
        if (track && track.length && track[0].status) {
            const status = track[0].status[track[0].status?.length - 1];
            if (track[0].user && !(track[0].user instanceof Schema.Types.ObjectId))
                await bot.telegram.sendMessage(track[0].user.chatId, `${track[0].user.name}, tem atualização na área! 🥳

${!status.unity
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
                            : `${status.destiny.type} - ${status.destiny.city} / ${status.destiny.state.toUpperCase()} 🛫`}`}`}
`.trimEnd());
        }
    }
};
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
