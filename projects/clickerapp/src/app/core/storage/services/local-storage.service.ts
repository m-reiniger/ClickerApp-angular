/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    public static readonly COUNTERS_KEY = 'clickerapp-counters';
    private localStorage: Storage;

    constructor() {
        this.localStorage = window.localStorage;
    }

    public setItem(key: string, value: any): void {
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    public getItem(key: string): any {
        return JSON.parse(this.localStorage.getItem(key) || '[]');
    }

    public removeItem(key: string): void {
        this.localStorage.removeItem(key);
    }

    public clear(): void {
        this.localStorage.clear();
    }
}
