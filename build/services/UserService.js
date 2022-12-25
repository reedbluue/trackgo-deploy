import { UserDao } from '../daos/UserDao.js';
import { UserCreateError } from '../errors/userErrors.js';
import { UserSessionService } from './UserSessionService.js';
export class UserService {
    static async adicionar(user) {
        try {
            return await UserDao.create(user);
        }
        catch (err) {
            throw new UserCreateError(err);
        }
    }
    static async buscaPorTelegramId(telegramId) {
        try {
            const user = (await UserDao.read({ telegramId }))[0];
            if (!user) {
                if (await UserSessionService.checkSession(telegramId)) {
                    await UserSessionService.removeSession(telegramId);
                    return null;
                }
                else {
                    return null;
                }
            }
            else {
                return user;
            }
        }
        catch (err) {
            throw new UserCreateError(err);
        }
    }
}
