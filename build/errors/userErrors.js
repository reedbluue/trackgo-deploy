export class UserCreateError extends Error {
    code;
    constructor(err = 'Falha ao cadastrar o usuário!') {
        if (typeof err === typeof '') {
            super(err);
            this.code = '1';
        }
        else {
            let message = err.message;
            if (err.name === 'ValidationError') {
                for (let prop in err.errors) {
                    message = err.errors[prop].message;
                }
                super(message);
                this.code = '2';
            }
            else if (err.name === 'MongoServerError') {
                switch (err.code) {
                    case 11000:
                        super('Usuário já cadastrado no sistema!');
                        this.code = null;
                        break;
                    default:
                        super(err.message);
                        this.code = null;
                        break;
                }
            }
            else {
                super(message);
                this.code = null;
            }
        }
    }
}
export class UserSessionError extends Error {
    code;
    constructor(err = 'Falha no armazenamento de sessões!') {
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
export class UserValidationError extends Error {
    code;
    constructor(err = 'Falha ao validar o usuário!') {
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
