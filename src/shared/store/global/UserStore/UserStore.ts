import AuthApi from "@api/AuthApi";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { User } from "@model/user";
import UserStorage from "@services/UserStorage";
import getInitState from "@store/utils/get-init-state";
import normalizeUser from "@store/utils/normalize-user";
import { action, computed, makeObservable, observable, runInAction } from "mobx";

type PrivateField = 
    | '_user'
    | '_status'
    | '_error'

const REQUEST_STATE = {
    GET_USER: 'getUser',
    UPDATE_NAME: 'updateName',
    UPDATE_EMAIL: 'updateEmail',
    UPDATE_PASSWORD: 'updatePassword',
    CHECK_EMAIL: 'checkEmail'
} as const;

type RequestState = typeof REQUEST_STATE[keyof typeof REQUEST_STATE];

export default class UserStore {
    private _user: User | null = null;
    private _status: Record<RequestState, MetaStatus> =  getInitState(Object.values(REQUEST_STATE), META_STATUS.IDLE);
    private _error: Record<RequestState, string | null> =  getInitState(Object.values(REQUEST_STATE), null);
    private abort: Record <RequestState, AbortController | null> = getInitState(Object.values(REQUEST_STATE), null);

    constructor(private api: AuthApi) {
        makeObservable<UserStore, PrivateField>(this, {
            _user: observable,
            _status: observable,
            _error: observable,

            user: computed,
            status: computed,
            error: computed,
            isUpdatingUser: computed,

            fetchUser: action.bound,
            updateUserField: action.bound,
            clearUser: action.bound,
        });

        this.api = api;
    }

    get user(): User | null {
        return this._user;
    }

    get status(): Record<RequestState, MetaStatus> {
        return this._status;
    }

    get error(): Record<RequestState, string | null> {
        return this._error;
    }

    get isUpdatingUser(): boolean {
        return (
            this._status.updateEmail === META_STATUS.PENDING ||
            this._status.updateName === META_STATUS.PENDING ||
            this._status.updatePassword === META_STATUS.PENDING
        );
    }

    clearUser(): void {
        this._user = null;
    }

    async fetchUser(): Promise<void> {
        if(this.abort.getUser) {
            this.abort.getUser.abort();
        }

        this.abort.getUser = new AbortController();
        this._status.getUser = META_STATUS.PENDING;
        this._error.getUser = null;

        try {
            const response = await this.api.getProfile(this.abort.getUser.signal);
            const user = normalizeUser(response);
            UserStorage.setUser(user);

            runInAction(() => {
                this._user = user;
                this._status.getUser = META_STATUS.SUCCESS;
                this.abort.getUser = null;
            });

        } catch(err) {
            runInAction(() => {
                this._error.getUser = err instanceof Error ? err.message : "UnknownError";
                this._status.getUser = META_STATUS.ERROR;
                this.abort.getUser = null;
            });
        } 
    }

    updateUser = async (data: Partial<User>): Promise<{ success: boolean }> => {
        const entities = Object.entries(data) as [keyof User, User[keyof User]][];

        if(entities.length === 0) {
            return { success: true };
        }


        const result = await Promise.allSettled(
            entities.map(([key, value]) => {
                if(value === undefined) {
                    Promise.resolve({ success: true });
                }

                return this.updateUserField(key, value);
            })
        );
        
        const allSuccess = result.every(
            res => res.status === 'fulfilled' && res.value.success === true          
        );

        return { success: allSuccess };
    };

    async updateUserField<K extends keyof User>(field: K, value: User[K] ): Promise<{ success: boolean }> {
        const targetField = this.getUpdatingFieldFromState(field);
        if(targetField === null || !this._user) {
            return ({
                success: false,
            });
        }
        
        if(this.abort[targetField]) {
            this.abort[targetField].abort();
        }

        this.abort[targetField] = new AbortController();
        this._error[targetField] = null;
        this._status[targetField] = META_STATUS.PENDING;

        try {
            const response = await this.api.updateProfile({ id: this._user?.id, [field]: value }, this.abort[targetField].signal);
            const user = normalizeUser(response);
            runInAction(() => {
                if(this._user) {
                    this._user[field] = user[field];
                }
                this.abort[targetField] = null;
                this._status[targetField] = META_STATUS.SUCCESS;
            });

            return ({
                success: true,
            });

        } catch(err) {
            runInAction(() => {
                this._error[targetField] = err instanceof Error ? err.message : "UnknownError";
                this._status[targetField] = META_STATUS.ERROR;
                this.abort[targetField] = null;               
            });

            return ({
                success: false,
            });
        }
    }

    async checkEmailAvailability(email: string): Promise<boolean | undefined> {
        if(this.abort.checkEmail) {
            this.abort.checkEmail.abort();
        }

        this._error.checkEmail = null;
        this.abort.checkEmail = new AbortController();
        this._status.checkEmail = META_STATUS.PENDING;

        try {
            const response = await this.api.checkEmail({ email }, this.abort.checkEmail.signal);
            
            runInAction(() => {
                this._status.checkEmail = META_STATUS.SUCCESS;
                this.abort.checkEmail = null;
            });

            return response.isAvailable;            
        } catch(err) {
            runInAction(() => {
                this._error.checkEmail = err instanceof Error ? err.message : "UnknownError";
                this._status.checkEmail = META_STATUS.ERROR;
                this.abort.checkEmail = null;

            });
            
            return undefined;
        }
    }

    private getUpdatingFieldFromState (field: keyof User): RequestState | null {
        switch(field) {
            case 'email':
                return REQUEST_STATE.UPDATE_EMAIL;

            case 'name':
                return REQUEST_STATE.UPDATE_NAME;

            case 'password':
                return REQUEST_STATE.UPDATE_PASSWORD;

            default:
                return null;
        }
    }
}