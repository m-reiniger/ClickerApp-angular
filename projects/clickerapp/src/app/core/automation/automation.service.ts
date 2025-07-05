import { inject, Injectable } from '@angular/core';

import { CounterService } from '../counter/counter.service';
import { StorageService } from '../storage/storage.service';

import {
    Automations,
    Automation,
    AutomationType,
    AutomationInterval,
    AutomationWeekday,
} from './automation.type';
import { Counter } from '../counter/counter.types';

@Injectable({
    providedIn: 'root',
})
export class AutomationService {
    public readonly MINUTE_IN_MS = 60000;

    private schedulerInterval: number = this.MINUTE_IN_MS;
    private automationScheduler: ReturnType<typeof setInterval> | null = null;

    private storageService = inject(StorageService);
    private counterService = inject(CounterService);

    constructor() {
        this.startAutomationScheduler();
    }

    public executeAllAutomations(): void {
        const automations = this.loadAutomations();

        for (const automation of automations) {
            if (this.shouldRunAutomation(automation)) {
                this.executeAutomation(automation);
            }
        }
    }

    public createAutomation(automation: Automation): Automation {
        this.saveAutomation(automation);
        return automation;
    }

    private loadAutomations(): Automations {
        const automations = this.storageService.loadAutomations();
        return automations || [];
    }

    private shouldRunAutomation(automation: Automation): boolean {
        const now = new Date();
        const nextRun = automation.action.nextRun;

        if (!automation.config.isActive) {
            return false;
        }

        if (now >= nextRun) {
            return true;
        }
        return false;
    }

    // TODO: run execution multiple times if time since the last run is longer than the interval
    private executeAutomation(automation: Automation): void {
        const counter: Counter | undefined = this.counterService.getCounter(automation.counterId);
        if (!counter) {
            return;
        }

        switch (automation.action.type) {
            case AutomationType.RESET:
                this.counterService.resetCounter(counter.id, true, true, automation.action.value);
                break;
            case AutomationType.INCREMENT:
                this.counterService.incrementCounter(counter.id, true, automation.action.value);
                break;
            case AutomationType.SET_VALUE:
                this.counterService.resetCounter(counter.id, true, true, automation.action.value);
                break;
        }

        this.updateAutomationNextRun(automation);

        // run execution again, if time since the last run is longer than the interval
        if (this.shouldRunAutomation(automation)) {
            this.executeAutomation(automation);
        }
    }

    private updateAutomationNextRun(automation: Automation): void {
        const lastRun = automation.action.nextRun;
        const nextRun = lastRun;

        switch (automation.config.interval) {
            case AutomationInterval.YEAR:
                nextRun.setFullYear(lastRun.getFullYear() + 1);
                if (automation.config.month !== undefined) {
                    automation.config.month = 0;
                }
                if (automation.config.day === undefined) {
                    automation.config.day = 1;
                }
                this.handleMonthOverflow(nextRun, automation.config.day);

                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                break;

            case AutomationInterval.MONTH:
                nextRun.setMonth(lastRun.getMonth() + 1);
                // if day is not set, set it to 1
                if (automation.config.day === undefined) {
                    automation.config.day = 1;
                }
                this.handleMonthOverflow(nextRun, automation.config.day);

                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                break;

            case AutomationInterval.WEEK:
                if (automation.config.weekday !== undefined) {
                    const weekdayMap = {
                        [AutomationWeekday.SUNDAY]: 0,
                        [AutomationWeekday.MONDAY]: 1,
                        [AutomationWeekday.TUESDAY]: 2,
                        [AutomationWeekday.WEDNESDAY]: 3,
                        [AutomationWeekday.THURSDAY]: 4,
                        [AutomationWeekday.FRIDAY]: 5,
                        [AutomationWeekday.SATURDAY]: 6,
                    };
                    const targetWeekday = weekdayMap[automation.config.weekday];
                    const currentWeekday = lastRun.getDay();
                    const daysToAdd = (targetWeekday - currentWeekday + 7) % 7;
                    if (daysToAdd === 0) {
                        nextRun.setDate(lastRun.getDate() + 7); // Next week
                    } else {
                        nextRun.setDate(lastRun.getDate() + daysToAdd);
                    }
                } else {
                    nextRun.setDate(lastRun.getDate() + 7);
                }
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                break;

            case AutomationInterval.DAY:
                nextRun.setDate(lastRun.getDate() + 1);
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                break;
        }

        automation.action.nextRun = nextRun;
        this.saveAutomation(automation);
    }

    private saveAutomation(automation: Automation): void {
        const automations = this.loadAutomations();
        const index = automations.findIndex((a) => a.id === automation.id);
        if (index !== -1) {
            automations[index] = automation;
        } else {
            automations.push(automation);
        }
        this.storageService.saveAutomations(automations);
    }

    private startAutomationScheduler(): void {
        // Run automations every minute
        this.automationScheduler = setInterval(() => {
            this.executeAllAutomations();
        }, this.schedulerInterval);
    }

    private stopAutomationScheduler(): void {
        if (this.automationScheduler) {
            clearInterval(this.automationScheduler);
            this.automationScheduler = null;
        }
    }

    private handleMonthOverflow(nextRun: Date, day: number): void {
        // handle month overflow e.g. 31.01.2025 -> 28.02.2025
        if (nextRun.getDate() !== day) {
            const correctMonth = nextRun.getMonth() - 1;
            while (nextRun.getMonth() !== correctMonth) {
                nextRun.setDate(nextRun.getDate() - 1);
            }
        } else {
            nextRun.setDate(day);
        }
    }
}
