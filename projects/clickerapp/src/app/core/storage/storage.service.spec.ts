import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { LocalStorageService } from './services/local-storage.service';
import { StorageService } from './storage.service';

import { Counters } from '@app/core/counter/counter.types';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

describe('StorageService', () => {
    let service: StorageService;
    let localStorageService: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StorageService, MockProvider(LocalStorageService)],
        });

        service = TestBed.inject(StorageService);
        localStorageService = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load counters from local storage', () => {
        const mockCounters: Counters = [
            {
                name: 'Test Counter',
                id: '1',
                transactions: [],
                defaultIncrement: 1,
                defaultOperation: TransactionOperation.ADD,
            },
        ];
        spyOn(localStorageService, 'getItem').and.returnValue(mockCounters);

        const result = service.loadCounters();

        expect(localStorageService.getItem).toHaveBeenCalledWith(LocalStorageService.COUNTERS_KEY);
        expect(result).toEqual(mockCounters);
    });

    it('should save counters to local storage', () => {
        const mockCounters: Counters = [
            {
                name: 'Test Counter',
                id: '1',
                transactions: [],
                defaultIncrement: 1,
                defaultOperation: TransactionOperation.SUBTRACT,
            },
        ];
        spyOn(localStorageService, 'setItem');

        service.saveCounters(mockCounters);

        expect(localStorageService.setItem).toHaveBeenCalledWith(
            LocalStorageService.COUNTERS_KEY,
            mockCounters
        );
    });

    it('should delete counters from local storage', () => {
        spyOn(localStorageService, 'removeItem');

        service.deleteCounters();

        expect(localStorageService.removeItem).toHaveBeenCalledWith(
            LocalStorageService.COUNTERS_KEY
        );
    });
});
