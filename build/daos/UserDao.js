import { User } from '../models/User.js';
export class UserDao {
    static async create(model) {
        const user = await User.create(model);
        return user;
    }
    static async read(keys) {
        const users = await User.find(keys);
        return users;
    }
    static async update(keys, model) {
        const users = await User.find(keys);
        users.map(async (user) => {
            return await user.update(model);
        });
        return await User.find(keys);
    }
    static async delete(keys) {
        const users = await User.find(keys);
        users.forEach(async (user) => {
            return await user.delete();
        });
    }
}
