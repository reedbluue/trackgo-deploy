import { Track } from '../models/Track.js';
export class TrackDao {
    static async create(model) {
        const track = await Track.create(model);
        return track;
    }
    static async read(keys, populate) {
        const tracks = !populate
            ? await Track.find(keys)
            : await Track.find(keys, {}, { populate: 'user' });
        return tracks;
    }
    static async update(keys, model, populate) {
        const tracks = await Track.find(keys);
        for (const track of tracks) {
            await track.updateOne(model);
        }
        const updatedTracks = !populate
            ? await Track.find(keys)
            : await Track.find(keys, {}, { populate: 'user' });
        return updatedTracks;
    }
    static async delete(keys) {
        const tracks = await Track.find(keys);
        if (!tracks.length)
            return false;
        tracks.forEach(async (track) => {
            await track.delete();
        });
        return true;
    }
}
