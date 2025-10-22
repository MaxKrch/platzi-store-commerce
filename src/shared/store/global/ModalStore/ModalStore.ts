import { Modes } from "@constants/modal";
import { action, computed, makeObservable, observable } from "mobx";

type PrivateFields = 
    | '_mode'
    | '_isOpen'

export default class ModalStore {
    private _mode: Modes | null = null;
    private _isOpen = false; 

    constructor() {
        makeObservable<ModalStore, PrivateFields>(this, {
            _mode: observable,
            _isOpen: observable,

            mode: computed,
            isOpen: computed,

            open: action.bound,
            close: action.bound,
        });
    }

    get mode(): Modes | null {
        return this._mode;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    open(mode: Modes): void {
        this._mode = mode;
        this._isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this._mode = null;
        this._isOpen = false;
        document.body.style.overflow = '';
    }
}