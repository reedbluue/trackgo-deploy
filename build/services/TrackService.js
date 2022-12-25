import { TrackDao } from '../daos/TrackDao.js';
import { TrackCreateError, TrackDeleteError, TrackReadError, } from '../errors/trackErrors.js';
import { TrackerHelper } from '../helpers/TrackerHelper.js';
export class TrackService {
    static async adicionar(track) {
        try {
            const { code, user } = track;
            const isNotUnique = await TrackService.isDuplicate(code, user);
            if (isNotUnique)
                throw new TrackCreateError('Já existe uma Track registrada com esse código para esse usuário!');
            return await TrackDao.create(track);
        }
        catch (err) {
            throw new TrackCreateError(err);
        }
    }
    static async deletar(trackId) {
        try {
            const del = await TrackDao.delete({ _id: trackId });
            if (!del)
                return false;
            return true;
        }
        catch (err) {
            throw new TrackDeleteError(err);
        }
    }
    static async listar(trackId) {
        try {
            return await TrackDao.read({ _id: trackId });
        }
        catch (err) {
            throw new TrackReadError(err);
        }
    }
    static async listarTodos(userId) {
        try {
            return await TrackDao.read({ user: userId });
        }
        catch (err) {
            throw new TrackReadError(err);
        }
    }
    static async atualizarTrack(trackId, keys) {
        try {
            const updateReturn = await TrackDao.update({ _id: trackId }, keys);
            if (!updateReturn || updateReturn.length)
                return null;
            return updateReturn;
        }
        catch (err) {
            throw new TrackReadError(err);
        }
    }
    static async atualizarTodasAsTracks() {
        try {
            const allTracks = await TrackDao.read({}, true);
            const tracksToUpdate = allTracks.filter((track) => {
                if (!track.status || !track.status.length)
                    return true;
                return track.status[track.status.length - 1].code !== 'BDE';
            });
            const rawTracks = await TrackerHelper.returnFrom(tracksToUpdate.map((tracks) => tracks.code));
            let updatedTracks = [];
            let i = 0;
            for (const track of tracksToUpdate) {
                const same = track.code == rawTracks[i].code;
                const statusNotExists = (!track.status && !rawTracks[i].status) || !rawTracks[i].status;
                const isNotSameLength = track.status?.length == rawTracks[i].status?.length;
                if (same && !statusNotExists && !isNotSameLength) {
                    const updatedTrack = await TrackDao.update({ _id: track.id }, rawTracks[i], true);
                    updatedTracks = [...updatedTracks, updatedTrack];
                }
                i++;
            }
            return updatedTracks;
        }
        catch (err) {
            throw new TrackReadError(err);
        }
    }
    static async isDuplicate(code, user) {
        try {
            const res = await TrackDao.read({ code, user });
            if (res.length > 0)
                return true;
            return false;
        }
        catch (err) {
            throw new TrackCreateError(err);
        }
    }
}
