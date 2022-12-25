const regex = /^[a-z]{2}\d{9}[a-z]{2}$/i;
export class CodeValidator {
    static check(code) {
        return regex.test(code);
    }
}
