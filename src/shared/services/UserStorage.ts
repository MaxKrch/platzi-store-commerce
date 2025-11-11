"use client";

import { SafeUser, User } from "@model/user";

export default class UserStorage {
    private static USER_KEY = "user";
    private static KEEP_LOGGED_KEY = "keepMeLoggedIn";
    
    static getUser(): SafeUser | null {
        const userJSON = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);      
        
        if(!userJSON) {
            return null;
        }

        return JSON.parse(userJSON);
    }

    static setUser(user: User): void {
        const shouldKeepLogged = this.getShouldKeepLogged();
        const storage = shouldKeepLogged ? localStorage : sessionStorage;
        const { password, ...rest } = user;
        void password;
        const cloneUser: SafeUser = rest;

        storage.setItem(this.USER_KEY, JSON.stringify(cloneUser));

        if(shouldKeepLogged) {
            localStorage.setItem(this.KEEP_LOGGED_KEY, "true");
        } else {
            localStorage.removeItem(this.KEEP_LOGGED_KEY);
        }
    }

    static getShouldKeepLogged(): boolean {
        return localStorage.getItem(this.KEEP_LOGGED_KEY) === "true";
    }

    static setShouldKeepLogged(save: boolean): void {
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

}