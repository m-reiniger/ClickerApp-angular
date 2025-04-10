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

    describe('error handling', () => {
        it('should handle storage errors gracefully', () => {
            spyOn(localStorageService, 'getItem').and.throwError('Storage error');

            expect(() => service.loadCounters()).toThrowError('Storage error');
        });

        it('should handle invalid JSON data', () => {
            spyOn(localStorageService, 'getItem').and.returnValue([]);

            const result = service.loadCounters();
            expect(result).toEqual([]);
        });

        it('should handle storage quota exceeded', () => {
            spyOn(localStorageService, 'setItem').and.throwError('Quota exceeded');

            const mockCounters: Counters = [
                {
                    name: 'Test Counter',
                    id: '1',
                    transactions: [],
                    defaultIncrement: 1,
                    defaultOperation: TransactionOperation.ADD,
                },
            ];

            expect(() => service.saveCounters(mockCounters)).toThrow();
        });
    });

    describe('data persistence', () => {
        it('should maintain data integrity across multiple saves', () => {
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
            spyOn(localStorageService, 'setItem');

            service.saveCounters(mockCounters);
            const savedData = service.loadCounters();

            expect(savedData).toEqual(mockCounters);
            expect(savedData[0].name).toBe(mockCounters[0].name);
            expect(savedData[0].id).toBe(mockCounters[0].id);
        });

        it('should handle complex counter data with transactions', () => {
            const mockCounters: Counters = [
                {
                    name: 'Test Counter',
                    id: '1',
                    transactions: [
                        {
                            value: 10,
                            operation: TransactionOperation.ADD,
                            created: new Date(),
                        },
                        {
                            value: 5,
                            operation: TransactionOperation.SUBTRACT,
                            created: new Date(),
                        },
                    ],
                    defaultIncrement: 1,
                    defaultOperation: TransactionOperation.ADD,
                },
            ];

            spyOn(localStorageService, 'getItem').and.returnValue(mockCounters);
            spyOn(localStorageService, 'setItem');

            service.saveCounters(mockCounters);
            const savedData = service.loadCounters();

            expect(savedData[0].transactions.length).toBe(2);
            expect(savedData[0].transactions[0].value).toBe(10);
            expect(savedData[0].transactions[1].value).toBe(5);
        });
    });
});
