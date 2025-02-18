import { Injectable } from '@angular/core';

import { LocalStorageService } from './services/local-storage.service';

import { Counters } from '../counter/counter.types';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private localStorageService: LocalStorageService) { }

    public loadCounters(): Counters {
        return this.localStorageService.getItem(LocalStorageService.COUNTERS_KEY);
    }

    public saveCounters(counters: Counters) {
        this.localStorageService.setItem(LocalStorageService.COUNTERS_KEY, counters);
    }

    public deleteCounters() {
        this.localStorageService.removeItem(LocalStorageService.COUNTERS_KEY);
    }
}



