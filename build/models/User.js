import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
        unique: true,
    },
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: null,
    },
    isBeta: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
export const User = mongoose.model('users', UserSchema);
