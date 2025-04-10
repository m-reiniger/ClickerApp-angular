import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should store and retrieve data', () => {
        const testKey = 'testKey';
        const testData = { test: 'data' };

        service.setItem(testKey, testData);
        const retrievedData = service.getItem(testKey);

        expect(retrievedData).toEqual(testData);
    });

    it('should return empty array for non-existent key', () => {
        const nonExistentKey = 'doesNotExist';

        const result = service.getItem(nonExistentKey);

        expect(result).toEqual([]);
    });

    it('should remove stored data', () => {
        const testKey = 'testKey';
        const testData = { test: 'data' };

        service.setItem(testKey, testData);
        service.removeItem(testKey);
        const retrievedData = service.getItem(testKey);

        expect(retrievedData).toEqual([]);
    });

    it('should clear all stored data', () => {
        service.setItem('key1', 'value1');
        service.setItem('key2', 'value2');

        service.clear();

        expect(service.getItem('key1')).toEqual([]);
        expect(service.getItem('key2')).toEqual([]);
    });

    it('should handle storing and retrieving arrays', () => {
        const testKey = 'arrayTest';
        const testArray = [1, 2, 3, 4, 5];

        service.setItem(testKey, testArray);
        const retrievedArray = service.getItem(testKey);

        expect(retrievedArray).toEqual(testArray);
    });

    it('should handle storing and retrieving complex objects', () => {
        const testKey = 'complexObject';
        const testObject = {
            name: 'Test',
            numbers: [1, 2, 3],
            nested: {
                property: 'value',
            },
        };

        service.setItem(testKey, testObject);
        const retrievedObject = service.getItem(testKey);

        expect(retrievedObject).toEqual(testObject);
    });
});
