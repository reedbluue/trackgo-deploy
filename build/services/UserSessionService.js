import Keyv from '@keyvhq/core';
import { UserSessionError } from '../errors/userErrors.js';
import dotenv from 'dotenv';
dotenv.config();
const { SESSIONS_TLL } = process.env;
const userSessionStorage = new Keyv({ namespace: 'users' });
export class UserSessionService {
    static async checkSession(telegramId) {
        if (!telegramId)
            throw new UserSessionError('ID do usuário inválido!');
        return await userSessionStorage.get(telegramId);
    }
    static async addSession(user) {
        if (!user)
            throw new UserSessionError('Usuário indefinido!');
        return await userSessionStorage.set(user.telegramId, user, Number(SESSIONS_TLL));
    }
    static async removeSession(telegramId) {
        return await userSessionStorage.delete(telegramId);
    }
    static async resetAllSessions() {
        return await userSessionStorage.clear();
    }
}
