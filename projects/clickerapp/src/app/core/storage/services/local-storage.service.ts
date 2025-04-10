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
        try {
            this.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            // Silently fail for quota exceeded errors
        }
    }

    public getItem(key: string): any {
        try {
            const item = this.localStorage.getItem(key);
            if (!item) {
                return [];
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    public removeItem(key: string): void {
        try {
            this.localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    public clear(): void {
        try {
            this.localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}
