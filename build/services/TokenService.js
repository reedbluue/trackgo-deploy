import Keyv from '@keyvhq/core';
import { JWTHelper } from '../helpers/JWTHelper.js';
const TokenStorage = new Keyv({ namespace: 'tokens' });
export class TokenService {
    static async generateKey() {
        const token = JWTHelper.generate();
        await TokenStorage.set(token, true);
        return token;
    }
    static async validateKey(token) {
        const isValid = await TokenStorage.has(token);
        if (!isValid)
            return false;
        await TokenStorage.delete(token);
        return true;
    }
    static async resetAllSessions() {
        return await TokenStorage.clear();
    }
}
