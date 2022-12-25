export class BotConnectionError extends Error {
    code;
    constructor(err = 'Falha de conexão com a API do Telegram!') {
        if (typeof err === typeof '') {
            super(err);
            this.code = '1';
        }
        else {
            let message = err.message;
            super(message);
            this.code = null;
        }
    }
}
