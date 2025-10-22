import { STORAGE_KEYS } from "@constants/storage";
import { User } from "@model/auth";

export default class UserStorage {
    static getToken(): string | null {
        let token = localStorage.getItem(STORAGE_KEYS.TOKEN);
       
        if(!token) {
            token = sessionStorage.getItem(STORAGE_KEYS.TOKEN) ?? null;
        }

        return token;
    }

    static getUser(): User | null {
        let userJSON = localStorage.getItem(STORAGE_KEYS.USER);

        if(!userJSON) {
            userJSON = sessionStorage.getItem(STORAGE_KEYS.USER);      
        }

        if(!userJSON) {
            return null;
        }

        return JSON.parse(userJSON);
    }

    static setToken(token: string, storage: Storage = localStorage): void {
        storage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    static setUser(user:User, storage: Storage = localStorage): void {
        storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    static clearStorage(): void {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
}