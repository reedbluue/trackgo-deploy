import dotenv from 'dotenv';
dotenv.config();
const { ADMIN_USERNAME } = process.env;
export const adminValidation = (ctx, next) => {
    if (!(ctx.from?.username === ADMIN_USERNAME))
        return;
    next();
};
