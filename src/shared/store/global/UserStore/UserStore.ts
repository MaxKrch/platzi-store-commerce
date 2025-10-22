import AuthApi from "@api/AuthApi";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { AuthData, RegisterData, User, UserApi } from "@model/auth";
import normalizeUser from "@store/utils/normalize-user";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import UserStorage from "src/shared/services/UserStorage";

type PrivateFields = 
    | '_user'
    | '_token'
    | '_status'
    | '_isAuthorized'
    | '_error'

export default class UserStore {
    private _user: User | null = null;
    private _token: string | null = null;
    private _status: MetaStatus = META_STATUS.IDLE;
    private _isAuthorized: boolean = false;
    private _error: string | null = null;
    private api: AuthApi;

    constructor(api: AuthApi) {
        makeObservable<UserStore, PrivateFields>(this, {
            _user: observable,
            _token: observable,
            _status: observable,
            _isAuthorized: observable,
            _error: observable,

            user: computed,
            token: computed,
            status: computed,
            isAuthorized: computed,
            error: computed,

            register: action.bound,
            login: action.bound,
            logout: action.bound,
        });

        this.api = api;
        this._initFromStorage();
    }

    get user(): User | null {
        return this._user;
    }

    get token(): string | null {
        return this._token;
    }

    get status(): MetaStatus {
        return this._status;
    }

    get error(): string | null {
        return this._error;
    }

    get isAuthorized(): boolean {
        return this._isAuthorized;
    }

    async register(data: RegisterData, save: boolean): Promise<{success: boolean}> {
        return this._authRequest(data, this.api.register, save);
    }

    async login(data: AuthData, save: boolean): Promise<{success: boolean}> {
        return this._authRequest(data, this.api.login, save);
    }

    logout(): { success: boolean } {
        this._clearUserData();
        this._clearStorage();
        this._isAuthorized = false;

        return { success: true };
    }

    private _initFromStorage(): void {
        if(typeof window === "undefined") {
            return;
        }
 
        try {
            const data = this._loadFromStorage();
            this._setUserData(data);
    
        } catch {
            this._clearUserData();
            this._clearStorage();
        }
    }

    private _loadFromStorage(): { user: User, token: string } {
        const user = UserStorage.getUser();
        const token = UserStorage.getToken();

        if(!user || !token) {
            throw new Error('FailLoad');
        }

        return {
            user,
            token,
        };
    }

    private _saveToStorage(data: {user: User, token: string}, storage: Storage): void {
        UserStorage.setToken(data.token, storage);
        UserStorage.setUser(data.user, storage);
    }

    private _clearStorage(): void {
        UserStorage.clearStorage();
    }

    private _setUserData(data: {user: User, token: string}): void {
        this._user = data.user;
        this._token = data.token;
        this._isAuthorized = true;
    }

    private _clearUserData(): void {
        this._user = null;
        this._token = null;
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

    private async _authRequest<T extends RegisterData | AuthData>(
        data: T, 
        request: (data: T) => Promise<{user: UserApi, jwt: string}>, 
        save: boolean
    ): Promise<{success: boolean}> {
        if(this._status === META_STATUS.PENDING) {
            return { success: false };
        }

        runInAction(() => {
            this._clearUserData();
            this._clearStorage();
            this._status = META_STATUS.PENDING;
            this._error = null;
        });
        
        try {
            const response = await request(data);
            if(!response.user || !response.jwt) {
                throw new Error('AuthError');
            }

            const respData = {
                user: normalizeUser(response.user),
                token: response.jwt
            };
            const storage = save ? localStorage : sessionStorage;            

            runInAction(() => {
                this._setUserData(respData);
                this._saveToStorage(respData, storage);
                this._status = META_STATUS.SUCCESS;
            });
            return { success: true };

        } catch(err) {
            runInAction(() => {
                const errorMessage = err instanceof Error ? err.message : "UnknownError";
                this._formateErrorMessage(errorMessage);
                this._clearUserData();
                this._clearStorage();       
                this._status = META_STATUS.ERROR;
            });
            return { success: false};
        }

    } 

}