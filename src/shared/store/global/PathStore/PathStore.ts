import { action, computed, makeObservable, observable } from "mobx";
import { useRouter } from "next/navigation";

type RouterType = ReturnType<typeof useRouter>

type PrivateFields = 
    | '_segments'

export default class PathStore {
    private _segments: string[] = [];

    constructor(path: string) {
        makeObservable<PathStore, PrivateFields>(this, {
            _segments: observable,
            
            segments: computed,
            pathString: computed,

            synchWithPath: action.bound,
        });

        this.synchWithPath(path);
    }

    get segments(): string[] {
        return this._segments;
    }

    get pathString(): string {
        return `/${this._segments.join('/')}`;
    }

    updateURL = (router: RouterType, path: string[]): void => {
        const newPath = `/${path.join('/')}`;
        router.push(newPath);
    };

    synchWithPath(path: string): void {
        this._segments = path.split('/').filter(Boolean);
    }
}