import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { DbConnectionError } from '../errors/dbErrors.js';
dotenv.config();
const URI = process.env.CONNECTION_STRING;
if (!URI)
    throw new DbConnectionError('A string de conexão é inválida!');
mongoose.connection.on('error', (err) => {
    throw new DbConnectionError(err.error);
});
export const startDbConnection = async () => {
    if (!mongoose.connection.readyState) {
        try {
            console.log('Iniciando conexão com o banco de dados...');
            await mongoose.connect(URI);
            return console.log(chalk.green('Sucesso na conexão com o banco de dados!'));
        }
        catch (err) {
            throw new DbConnectionError();
        }
    }
};
