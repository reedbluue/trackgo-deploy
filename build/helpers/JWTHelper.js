import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { PRIVATE_KEY } = process.env;
export class JWTHelper {
    static generate() {
        return jsonwebtoken.sign({}, PRIVATE_KEY, {
            expiresIn: '24h',
        });
    }
    static validate(token) {
        return jsonwebtoken.verify(token, PRIVATE_KEY) ? true : false;
    }
}
