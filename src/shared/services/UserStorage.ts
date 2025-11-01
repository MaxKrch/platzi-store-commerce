"use client";

import { User } from "@model/user";

export default class UserStorage {
    private static USER_KEY = "user";
    private static KEEP_LOGGED_KEY = "keepMeLoggedIn";
    
    static getUser(): User | null {
        const userJSON = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);      
        
        if(!userJSON) {
            return null;
        }

        return JSON.parse(userJSON);
    }

    static setUser(user: User, save: boolean): void {
        const storage = save ? localStorage : sessionStorage;
        storage.setItem(this.USER_KEY, JSON.stringify(user));

        if(save) {
            localStorage.setItem(this.KEEP_LOGGED_KEY, "true");
        } else {
            localStorage.removeItem(this.KEEP_LOGGED_KEY);
        }
    }

    static clearStorage(): void {
        localStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.KEEP_LOGGED_KEY);
    }

    static shouldKeepLogged(): boolean {
        return localStorage.getItem(this.KEEP_LOGGED_KEY) === "true";
    }
}