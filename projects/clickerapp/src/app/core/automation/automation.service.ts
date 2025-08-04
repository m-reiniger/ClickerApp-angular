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

    private weekdayMap = {
        [AutomationWeekday.SUNDAY]: 0,
        [AutomationWeekday.MONDAY]: 1,
        [AutomationWeekday.TUESDAY]: 2,
        [AutomationWeekday.WEDNESDAY]: 3,
        [AutomationWeekday.THURSDAY]: 4,
        [AutomationWeekday.FRIDAY]: 5,
        [AutomationWeekday.SATURDAY]: 6,
    };

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

    public getAutomations(counterId: string): Automations {
        const automations = this.loadAutomations();
        return automations.filter((automation) => automation.counterId === counterId);
    }

    public createAutomation(automation: Automation): Automation {
        this.saveAutomation(automation);
        return automation;
    }

    public saveAutomations(automations: Automation[]): void {
        automations.forEach((automation) => {
            this.setInitialNextRun(automation);
            if (automation.id === undefined) {
                this.createAutomation(automation);
            } else {
                this.saveAutomation(automation);
            }
        });
    }

    private loadAutomations(): Automations {
        const automations = this.storageService.loadAutomations();
        return automations || [];
    }

    private shouldRunAutomation(automation: Automation): boolean {
        const now = new Date();
        const nextRun = new Date(automation.action.nextRun);

        // console.log('checking if automation should run', nextRun, now);

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

    private setInitialNextRun(automation: Automation): void {
        const now = new Date();
        const nextRun = new Date(now);

        switch (automation.config.interval) {
            case AutomationInterval.YEAR:
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                nextRun.setDate(1);
                nextRun.setMonth((automation.config.month || 0) - 1);
                this.setCorrectDayOfMonth(nextRun, automation.config.day || 1);
                if (nextRun < now) {
                    this.incrementByXMonth(nextRun, automation.config.day || 1, 12);
                }
                break;
            case AutomationInterval.MONTH:
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                this.setCorrectDayOfMonth(nextRun, automation.config.day || 1);
                if (nextRun < now) {
                    this.incrementByXMonth(nextRun, automation.config.day || 1, 1);
                }
                break;
            case AutomationInterval.WEEK:
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                const targetWeekday =
                    this.weekdayMap[automation.config.weekday || AutomationWeekday.SUNDAY];
                const currentWeekday = now.getDay();
                const daysToAdd = (targetWeekday - currentWeekday + 7) % 7;
                nextRun.setDate(now.getDate() + daysToAdd);
                if (nextRun < now) {
                    nextRun.setDate(now.getDate() + 7);
                }
                break;
            case AutomationInterval.DAY:
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                if (nextRun < now) {
                    nextRun.setDate(now.getDate() + 1);
                }
                break;
        }
        automation.action.nextRun = nextRun;
    }

    private updateAutomationNextRun(automation: Automation): void {
        const lastRun = new Date(automation.action.nextRun);
        const nextRun = lastRun;

        switch (automation.config.interval) {
            case AutomationInterval.YEAR:
                if (automation.config.month === undefined) {
                    automation.config.month = 0;
                }
                if (automation.config.day === undefined) {
                    automation.config.day = 1;
                }
                this.incrementByXMonth(nextRun, automation.config.day, 12);
                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                break;

            case AutomationInterval.MONTH:
                if (automation.config.day === undefined) {
                    automation.config.day = 1;
                }
                this.incrementByXMonth(nextRun, automation.config.day, 1);

                nextRun.setHours(automation.config.hour, automation.config.minute, 0, 0);
                break;

            case AutomationInterval.WEEK:
                if (automation.config.weekday !== undefined) {
                    const targetWeekday = this.weekdayMap[automation.config.weekday];
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

    private isInPast(date: Date): boolean {
        const now = new Date();
        return date < now;
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
        this.executeAllAutomations();
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

    private setCorrectDayOfMonth(nextRun: Date, day: number): void {
        if (day > this.lastDayOfMonth(nextRun.getFullYear(), nextRun.getMonth())) {
            nextRun.setDate(this.lastDayOfMonth(nextRun.getFullYear(), nextRun.getMonth()));
        } else {
            nextRun.setDate(day);
        }
    }

    private incrementByXMonth(nextRun: Date, day: number, addMonth: number): void {
        if (day > this.lastDayOfMonth(nextRun.getFullYear(), nextRun.getMonth() + addMonth)) {
            nextRun.setMonth(
                nextRun.getMonth() + addMonth,
                this.lastDayOfMonth(nextRun.getFullYear(), nextRun.getMonth() + addMonth)
            );
        } else {
            nextRun.setMonth(nextRun.getMonth() + addMonth, day);
        }
    }

    private lastDayOfMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }
}
