import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    static readonly COUNTERS_KEY = 'clickerapp-counters';
    private localStorage: Storage;

    constructor() {
        this.localStorage = window.localStorage;
    }

    public setItem(key: string, value: any) {
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    public getItem(key: string) {
        return JSON.parse(this.localStorage.getItem(key) || '[]');
    }

    public removeItem(key: string) {
        this.localStorage.removeItem(key);
    }

    public clear() {
        this.localStorage.clear();
    }
}
