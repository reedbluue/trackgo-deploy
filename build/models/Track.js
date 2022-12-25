import mongoose from 'mongoose';
import { User } from './User.js';
const TrackSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: true,
    },
    code: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    type: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    status: [Object],
});
User.on('ok', () => { });
export const Track = mongoose.model('tracks', TrackSchema);
