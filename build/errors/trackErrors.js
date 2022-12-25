export class TrackCreateError extends Error {
    code;
    constructor(err = 'Falha ao criar a Track!') {
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
            else {
                super(message);
                this.code = null;
            }
        }
    }
}
export class TrackDeleteError extends Error {
    code;
    constructor(err = 'Falha ao deletar a Track!') {
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
export class TrackReadError extends Error {
    code;
    constructor(err = 'Falha ao listar a Track!') {
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
