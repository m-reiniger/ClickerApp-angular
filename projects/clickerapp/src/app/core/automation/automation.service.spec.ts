import { TestBed } from '@angular/core/testing';
import { AutomationService } from './automation.service';
import { CounterService } from '../counter/counter.service';
import { StorageService } from '../storage/storage.service';
import {
    Automation,
    AutomationType,
    AutomationInterval,
    AutomationWeekday,
} from './automation.type';
import { TransactionOperation } from '../transaction/transaction.type';

describe('AutomationService', () => {
    let service: AutomationService;
    let counterService: jasmine.SpyObj<CounterService>;
    let storageService: jasmine.SpyObj<StorageService>;

    beforeEach(() => {
        const counterServiceSpy = jasmine.createSpyObj('CounterService', [
            'getCounter',
            'incrementCounter',
            'resetCounter',
        ]);
        const storageServiceSpy = jasmine.createSpyObj('StorageService', [
            'loadAutomations',
            'saveAutomations',
        ]);

        TestBed.configureTestingModule({
            providers: [
                AutomationService,
                { provide: CounterService, useValue: counterServiceSpy },
                { provide: StorageService, useValue: storageServiceSpy },
            ],
        });

        service = TestBed.inject(AutomationService);
        counterService = TestBed.inject(CounterService) as jasmine.SpyObj<CounterService>;
        storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

        // Setup default spy returns
        storageService.loadAutomations.and.returnValue([]);
        counterService.getCounter.and.returnValue({
            id: 'test-counter',
            name: 'Test Counter',
            transactions: [],
            defaultIncrement: 1,
            defaultOperation: TransactionOperation.ADD,
            initialValue: 0,
        });
    });

    afterEach(() => {
        // Clean up any intervals
        if (service['automationScheduler']) {
            clearInterval(service['automationScheduler']);
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createAutomation', () => {
        it('should create and save a new automation', () => {
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            service.createAutomation(automation);

            expect(storageService.saveAutomations).toHaveBeenCalledWith([automation]);
        });

        it('should update existing automation if id already exists', () => {
            const existingAutomation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            const updatedAutomation: Automation = {
                ...existingAutomation,
                action: {
                    ...existingAutomation.action,
                    value: 10,
                },
            };

            storageService.loadAutomations.and.returnValue([existingAutomation]);

            service.saveAutomations([updatedAutomation]);

            expect(storageService.saveAutomations).toHaveBeenCalledWith([updatedAutomation]);
        });
    });

    describe('shouldRunAutomation', () => {
        it('should return false for inactive automation', () => {
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: false,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            const result = service['shouldRunAutomation'](automation);
            expect(result).toBe(false);
        });

        it('should return true when current time is after next run time', () => {
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 1);

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: pastDate,
                },
            };

            const result = service['shouldRunAutomation'](automation);
            expect(result).toBe(true);
        });

        it('should return true when current time equals next run time', () => {
            const now = new Date();

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: now.getHours(),
                    minute: now.getMinutes(),
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: now,
                },
            };

            const result = service['shouldRunAutomation'](automation);
            expect(result).toBe(true);
        });

        it('should return false when current time is before next run time', () => {
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 1);

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: futureDate,
                },
            };

            const result = service['shouldRunAutomation'](automation);
            expect(result).toBe(false);
        });
    });

    describe('executeAutomation', () => {
        it('should execute INCREMENT automation', () => {
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            service['executeAutomation'](automation);

            expect(counterService.incrementCounter).toHaveBeenCalledWith(
                'test-counter',
                true,
                5,
                jasmine.any(Date)
            );
        });

        it('should execute RESET automation', () => {
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.RESET,
                    value: 10,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            service['executeAutomation'](automation);

            expect(counterService.resetCounter).toHaveBeenCalledWith(
                'test-counter',
                true,
                true,
                10,
                jasmine.any(Date)
            );
        });

        it('should execute SET_VALUE automation', () => {
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.SET_VALUE,
                    value: 15,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            service['executeAutomation'](automation);

            expect(counterService.resetCounter).toHaveBeenCalledWith(
                'test-counter',
                true,
                true,
                15,
                jasmine.any(Date)
            );
        });

        it('should not execute automation if counter does not exist', () => {
            counterService.getCounter.and.returnValue(undefined);

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'non-existent-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            service['executeAutomation'](automation);

            expect(counterService.incrementCounter).not.toHaveBeenCalled();
        });

        it('should update next run time after execution', () => {
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: new Date('2024-01-01T10:30:00'),
                },
            };

            service['executeAutomation'](automation);

            expect(storageService.saveAutomations).toHaveBeenCalled();
        });

        it('should execute automation multiple times if time since last run exceeds interval', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 3); // 3 days before now
            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: pastDate.getHours() - 1, // 1 hour before now
                    minute: pastDate.getMinutes(),
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: pastDate,
                },
            };

            service['executeAutomation'](automation);

            // Should be called multiple times due to recursive execution
            expect(counterService.incrementCounter).toHaveBeenCalledTimes(4); // 3 days and 1 houre before now = 4 executions
        });
    });

    describe('updateAutomationNextRun', () => {
        describe('YEAR interval', () => {
            it('should calculate next run for YEAR interval correctly', () => {
                const baseDate = new Date('2024-03-15T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.YEAR,
                        month: 3,
                        day: 15,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2025-03-15T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle leap year correctly', () => {
                const baseDate = new Date('2024-02-29T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.YEAR,
                        month: 2,
                        day: 29,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2025-02-28T10:30:00'); // 2025 is not a leap year
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle year interval without specific month and day', () => {
                const baseDate = new Date('2024-01-01T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.YEAR,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2025-01-01T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });
        });

        describe('MONTH interval', () => {
            it('should calculate next run for MONTH interval correctly', () => {
                const baseDate = new Date('2024-03-15T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.MONTH,
                        day: 15,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-04-15T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle month rollover correctly', () => {
                const baseDate = new Date('2024-12-15T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.MONTH,
                        day: 15,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2025-01-15T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle month interval without specific day', () => {
                const baseDate = new Date('2024-03-01T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.MONTH,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-04-01T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle day 31 in months with fewer days', () => {
                const baseDate = new Date('2024-01-31T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.MONTH,
                        day: 31,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-02-29T10:30:00'); // February 2024 (leap year)
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });
        });

        describe('WEEK interval', () => {
            it('should calculate next run for WEEK interval with specific weekday', () => {
                const baseDate = new Date('2024-01-15T10:30:00'); // Monday
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.WEEK,
                        weekday: AutomationWeekday.MONDAY,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-01-22T10:30:00'); // Next Monday
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should calculate next run for different weekday', () => {
                const baseDate = new Date('2024-01-15T10:30:00'); // Monday
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.WEEK,
                        weekday: AutomationWeekday.FRIDAY,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-01-19T10:30:00'); // Friday of same week
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle week interval without specific weekday', () => {
                const baseDate = new Date('2024-01-15T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.WEEK,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-01-22T10:30:00'); // 7 days later
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle all weekdays correctly', () => {
                const weekdays = [
                    AutomationWeekday.SUNDAY,
                    AutomationWeekday.MONDAY,
                    AutomationWeekday.TUESDAY,
                    AutomationWeekday.WEDNESDAY,
                    AutomationWeekday.THURSDAY,
                    AutomationWeekday.FRIDAY,
                    AutomationWeekday.SATURDAY,
                ];

                const baseDate = new Date('2024-01-15T10:30:00'); // Monday

                weekdays.forEach((weekday) => {
                    const automation: Automation = {
                        id: 'test-automation',
                        counterId: 'test-counter',
                        config: {
                            interval: AutomationInterval.WEEK,
                            weekday: weekday,
                            hour: 10,
                            minute: 30,
                            isActive: true,
                        },
                        action: {
                            type: AutomationType.INCREMENT,
                            value: 5,
                            nextRun: new Date(baseDate),
                        },
                    };

                    service['updateAutomationNextRun'](automation);

                    // Verify the result is a valid date
                    expect(automation.action.nextRun.getTime()).toBeGreaterThan(baseDate.getTime());
                    expect(automation.action.nextRun.getHours()).toBe(10);
                    expect(automation.action.nextRun.getMinutes()).toBe(30);
                });
            });
        });

        describe('DAY interval', () => {
            it('should calculate next run for DAY interval correctly', () => {
                const baseDate = new Date('2024-01-15T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-01-16T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle month rollover for day interval', () => {
                const baseDate = new Date('2024-01-31T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2024-02-01T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });

            it('should handle year rollover for day interval', () => {
                const baseDate = new Date('2024-12-31T10:30:00');
                const automation: Automation = {
                    id: 'test-automation',
                    counterId: 'test-counter',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: baseDate,
                    },
                };

                service['updateAutomationNextRun'](automation);

                const expectedNextRun = new Date('2025-01-01T10:30:00');
                expect(automation.action.nextRun.getTime()).toBe(expectedNextRun.getTime());
            });
        });
    });

    describe('executeAllAutomations', () => {
        it('should execute all active automations that should run', () => {
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 1);

            const automations: Automation[] = [
                {
                    id: 'automation-1',
                    counterId: 'counter-1',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: pastDate.getHours() - 1,
                        minute: pastDate.getMinutes(),
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: structuredClone(pastDate),
                    },
                },
                {
                    id: 'automation-2',
                    counterId: 'counter-2',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: pastDate.getHours() - 1,
                        minute: pastDate.getMinutes(),
                        isActive: false, // Inactive
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: structuredClone(pastDate),
                    },
                },
                {
                    id: 'automation-3',
                    counterId: 'counter-3',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: pastDate.getHours() - 1,
                        minute: pastDate.getMinutes(),
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.RESET,
                        value: 10,
                        nextRun: structuredClone(pastDate),
                    },
                },
            ];

            counterService.getCounter.withArgs('counter-1').and.returnValue({
                id: 'counter-1',
                name: 'Test Counter',
                transactions: [],
                defaultIncrement: 1,
                defaultOperation: TransactionOperation.ADD,
                initialValue: 0,
            });
            counterService.getCounter.withArgs('counter-2').and.returnValue({
                id: 'counter-2',
                name: 'Test Counter',
                transactions: [],
                defaultIncrement: 1,
                defaultOperation: TransactionOperation.ADD,
                initialValue: 0,
            });
            counterService.getCounter.withArgs('counter-3').and.returnValue({
                id: 'counter-3',
                name: 'Test Counter',
                transactions: [],
                defaultIncrement: 1,
                defaultOperation: TransactionOperation.RESET,
                initialValue: 0,
            });

            storageService.loadAutomations.and.returnValue(automations);

            service.executeAllAutomations();

            expect(counterService.incrementCounter).toHaveBeenCalledWith(
                'counter-1',
                true,
                5,
                jasmine.any(Date)
            );
            expect(counterService.resetCounter).toHaveBeenCalledWith(
                'counter-3',
                true,
                true,
                10,
                jasmine.any(Date)
            );
            expect(counterService.incrementCounter).not.toHaveBeenCalledWith(
                'counter-2',
                jasmine.any(Boolean),
                jasmine.any(Number),
                jasmine.any(Date)
            );
        });

        it('should not execute automations that should not run yet', () => {
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 1);

            const automations: Automation[] = [
                {
                    id: 'automation-1',
                    counterId: 'counter-1',
                    config: {
                        interval: AutomationInterval.DAY,
                        hour: 10,
                        minute: 30,
                        isActive: true,
                    },
                    action: {
                        type: AutomationType.INCREMENT,
                        value: 5,
                        nextRun: futureDate,
                    },
                },
            ];

            storageService.loadAutomations.and.returnValue(automations);

            service.executeAllAutomations();

            expect(counterService.incrementCounter).not.toHaveBeenCalled();
        });
    });

    describe('Multiple execution scenarios', () => {
        it('should execute automation multiple times when time since last run exceeds interval significantly', () => {
            const longPastDate = new Date();
            longPastDate.setDate(longPastDate.getDate() - 4); // 4 days ago

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: longPastDate.getHours(),
                    minute: longPastDate.getMinutes() - 10,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: longPastDate,
                },
            };

            storageService.loadAutomations.and.returnValue([automation]);

            service.executeAllAutomations();

            // Should execute 5 times (once for each day including today)
            expect(counterService.incrementCounter).toHaveBeenCalledTimes(5);
        });

        it('should execute automation multiple times for week interval', () => {
            const longPastDate = new Date();
            longPastDate.setDate(longPastDate.getDate() - 21); // 3 weeks ago

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.WEEK,
                    weekday: AutomationWeekday.MONDAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: longPastDate,
                },
            };

            storageService.loadAutomations.and.returnValue([automation]);

            service.executeAllAutomations();

            // Should execute multiple times for the weeks that passed
            expect(counterService.incrementCounter).toHaveBeenCalled();
            expect(counterService.incrementCounter).toHaveBeenCalledWith(
                'test-counter',
                true,
                5,
                jasmine.any(Date)
            );
        });

        it('should handle automation with non-existent counter gracefully', () => {
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 1);

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'non-existent-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: 10,
                    minute: 30,
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: pastDate,
                },
            };

            storageService.loadAutomations.and.returnValue([automation]);
            counterService.getCounter.and.returnValue(undefined);

            service.executeAllAutomations();

            expect(counterService.incrementCounter).not.toHaveBeenCalled();
        });
    });

    describe('Automation scheduler', () => {
        it('should start automation scheduler on service creation', () => {
            expect(service['automationScheduler']).toBeTruthy();
        });

        it('should execute automations when scheduler runs', (done) => {
            service['schedulerInterval'] = 50;
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 1);

            const automation: Automation = {
                id: 'test-automation',
                counterId: 'test-counter',
                config: {
                    interval: AutomationInterval.DAY,
                    hour: pastDate.getHours(),
                    minute: pastDate.getMinutes(),
                    isActive: true,
                },
                action: {
                    type: AutomationType.INCREMENT,
                    value: 5,
                    nextRun: pastDate,
                },
            };

            storageService.loadAutomations.and.returnValue([automation]);
            service['startAutomationScheduler']();

            // Wait for the scheduler to run (it runs every minute, but we can test the initial execution)
            setTimeout(() => {
                expect(counterService.incrementCounter).toHaveBeenCalled();
                done();
            }, 100);
        });
    });
});
