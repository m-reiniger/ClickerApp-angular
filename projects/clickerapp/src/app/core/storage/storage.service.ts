import { inject, Injectable } from '@angular/core';

import { LocalStorageService } from './services/local-storage.service';

import { Counters } from '@app/core/counter/counter.types';

/**
 * Service responsible for persisting counter data to local storage.
 * Provides a clean interface for saving, loading, and deleting counter data.
 */
@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private localStorageService = inject(LocalStorageService);

    /**
     * Loads the current list of counters from local storage
     * @returns The array of counters, or an empty array if none exist
     */
    public loadCounters(): Counters {
        return this.localStorageService.getItem(LocalStorageService.COUNTERS_KEY);
    }

    /**
     * Saves the current list of counters to local storage
     * @param counters - The array of counters to save
     */
    public saveCounters(counters: Counters): void {
        this.localStorageService.setItem(LocalStorageService.COUNTERS_KEY, counters);
    }

    /**
     * Deletes all counters from local storage
     */
    public deleteCounters(): void {
        this.localStorageService.removeItem(LocalStorageService.COUNTERS_KEY);
    }
}
