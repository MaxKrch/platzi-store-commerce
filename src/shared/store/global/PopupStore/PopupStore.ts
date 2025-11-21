import { action, computed, makeObservable, observable } from "mobx";

export const POPUP_TYPES = {
    USER_MENU: 'userMenu',
} as const; 

export type PopupTypes = typeof POPUP_TYPES[keyof typeof POPUP_TYPES];

export type PopupItem = {
    id: string;
    type: PopupTypes;
    closeOnOutsideClick?: boolean
}

type PrivateField = 
    | '_popups'

export default class PopupStore {
    private _popups: PopupItem[] = [];

    constructor() {
        makeObservable<PopupStore, PrivateField>(this, {
            _popups: observable,

            popups: computed,

            addPopup: action.bound,
            removePopupByType: action.bound,            
        });
    }

    get popups(): PopupItem[] {
        return this._popups;
    }

    addPopup(data: Omit<PopupItem, 'id'>): PopupItem['id'] {
        const id = crypto.randomUUID();
        const preparedPopups = this._popups.filter(item => item.type !== data.type); 
        this._popups = [...preparedPopups, { ...data, id }];
        
        return id;
    }

    removePopupByType(type: PopupItem['type']): void {
        this._popups = this._popups.filter(item => item.type !== type);
    }

    getPopupByType(type: PopupItem['type']): PopupItem | null {
        return this._popups.find(item => item.type === type) ?? null;
    }
}