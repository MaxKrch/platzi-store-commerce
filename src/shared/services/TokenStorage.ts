type Token = null | string;

class TokenStorage {
    private _token: Token = null;

    get token(): Token {
        return this._token;
    }

    set token(token: Token) {
        this._token = token;
    }
}

const tokenStorage = new TokenStorage();
export default tokenStorage;