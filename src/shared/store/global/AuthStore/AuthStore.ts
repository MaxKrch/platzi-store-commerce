import AuthApi from "@api/AuthApi";
import { AuthData, RegisterUserData } from "@model/platzi-api";
import { User } from "@model/user";
import TokenStorage from "@services/TokenStorage";
import normalizeUser from "@store/utils/normalize-user";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import UserStorage from "src/shared/services/UserStorage";

export const AUTH_META_STATUS = {
    IDLE: 'idle',
    REGISTERING: 'registering',
    LOGGING_IN: 'loggingIn',
    LOGGING_OUT: 'loggingOut',
    AUTHENTICATING: 'authenticating',
    ERROR: 'error',
    SUCCESS: 'success'
} as const;

export type AuthMetaStatus = typeof AUTH_META_STATUS[keyof typeof AUTH_META_STATUS]

type PrivateFields = 
    | '_user'
    | '_status'
    | '_isAuthorized'
    | '_error'

export default class AuthStore {
    private _user: User | null = null;
    private _status: AuthMetaStatus = AUTH_META_STATUS.IDLE;
    private _abortCtrl: Record<string, AbortController | null> = {
        getUser: null,
    };
    private _isAuthorized: boolean = false;
    private _error: string | null = null;
    private api: AuthApi;

    constructor(api: AuthApi) {
        makeObservable<AuthStore, PrivateFields>(this, {
            _user: observable,
            _status: observable,
            _isAuthorized: observable,
            _error: observable,

            user: computed,
            status: computed,
            isPending: computed,
            isAuthorized: computed,
            error: computed,

            register: action.bound,
            login: action.bound,
            logout: action.bound,
            initAuth: action.bound,
        });

        this.api = api;
    }

    get user(): User | null {
        return this._user;
    }

    get token(): string | null {
        return TokenStorage.token;
    }

    get status(): AuthMetaStatus {
        return this._status;
    }

    get isPending(): boolean {
        return (
            this._status === AUTH_META_STATUS.REGISTERING ||
            this._status === AUTH_META_STATUS.LOGGING_IN ||
            this._status === AUTH_META_STATUS.AUTHENTICATING
        );
    }

    get error(): string | null {
        return this._error;
    }

    get isAuthorized(): boolean {
        return this._isAuthorized;
    }

    private _setToken(token: string | null): void {
        TokenStorage.token = token;
    }

    async register(data: RegisterUserData): Promise<{success: boolean}> {
        if(this._status === AUTH_META_STATUS.REGISTERING || this._status === AUTH_META_STATUS.LOGGING_IN) {
            return { success: false };
        }

        runInAction(() => {
            this._error = null;
            this._status = AUTH_META_STATUS.REGISTERING;
        });
        
        try {
            const response = await this.api.register(data); 

            await this.login({
                email: response.email,
                password: response.password,
                keepMeLoggedIn: data.keepMeLoggedIn
            });

            return { success: true };

        } catch(err) {
            runInAction(() => {
                const errorMessage = err instanceof Error ? err.message : "UnknownError";
                this._formateErrorMessage(errorMessage);
                this._status = AUTH_META_STATUS.ERROR;
                this._clearUserData();
            });

            return { success: false};
        }
    }

    async login(data: AuthData): Promise<{success: boolean}> {
        if(this._status === AUTH_META_STATUS.LOGGING_IN) {
            return { success: false };
        }

        runInAction(() => {
            this._error = null;
            this._status = AUTH_META_STATUS.LOGGING_IN;
        });
        
        try {
            const response = await this.api.login(data); 

            if(!response.success) {
                throw new Error(response.error);
            }

            runInAction(() => {
                this._setToken(response.token);
                this._status = AUTH_META_STATUS.SUCCESS;
                this._isAuthorized = true;
                this.api._client.resetRefreshFailed();
            });

            this._getUserData(data.keepMeLoggedIn);

            return { success: true };

        } catch(err) {
            runInAction(() => {
                const errorMessage = err instanceof Error ? err.message : "UnknownError";
                this._formateErrorMessage(errorMessage);
                this._status = AUTH_META_STATUS.ERROR;
                this._clearUserData();
            });

            return { success: false};
        }
    }

    async logout(): Promise<{ success: boolean }> {
        if(this._status === AUTH_META_STATUS.LOGGING_OUT) {
            return { success: false };
        }

        runInAction(() => {
            this._clearUserData();
            this._error = null;
        });
        
        try {
            const response = await this.api.logout(); 

            if(!response.success) {
                throw new Error(response.error);
            }

            runInAction(() => {
                this._clearUserData();
            });

            return { success: true };

        } catch(err) {
            runInAction(() => {
                const errorMessage = err instanceof Error ? err.message : "UnknownError";
                this._formateErrorMessage(errorMessage);
                this._status = AUTH_META_STATUS.ERROR;
            });

            return { success: false};
        }
    }

    async initAuth(): Promise<void> {
        if(this._status === AUTH_META_STATUS.AUTHENTICATING) {
            return;
        }

        if(!UserStorage.shouldKeepLogged()) {
            return;
        }

        runInAction(() => {
            this._error = null;
            this._status = AUTH_META_STATUS.AUTHENTICATING;
        });
        
        try {
            const response = await this.api.refreshTokens({keepMeLoggedIn: true});
    
            if(!response.success) {
                throw new Error(response.error);
            }

            runInAction(() => {
                this._setToken(response.token);
                this._isAuthorized = true;
            });

            this._getUserData(true);

        } catch(err) {
            runInAction(() => {
                const errorMessage = err instanceof Error ? err.message : "UnknownError";
                this._formateErrorMessage(errorMessage);
                this._status = AUTH_META_STATUS.ERROR;
                this._clearUserData();
            });
        }
    }

    private async _getUserData(save: boolean): Promise<void> {
        if(this._abortCtrl.getUser) {
            this._abortCtrl.getUser.abort();
        }

        this._abortCtrl.getUser = new AbortController();

        try {
            const response = await this.api.getProfile();
            const user = normalizeUser(response);
            UserStorage.setUser(user, save);

            runInAction(() => {
                this._user = user;
            });

        } catch(err) {
            const errorMessage = err instanceof Error ? err.message : "UnknownError";
            this._formateErrorMessage(errorMessage);
            this._clearUserData();

        } finally {
            this._abortCtrl.getUser = null;
        }
    }

    private _clearUserData(): void {
        UserStorage.clearStorage();
        
        this._user = null;
        this._setToken(null);
        this._isAuthorized = false;
    }

    private _formateErrorMessage(message: string): void {
        switch(message) {
            case 'Invalid identifier or password':
                this._error = 'Неверный логин или пароль';
                break;

            default:
                this._error = 'Сервер недоступен';
        }
    }
}

