export type Automations = Automation[];

export enum AutomationType {
    RESET = 'reset',
    INCREMENT = 'increment',
    SET_VALUE = 'set-value',
}

export enum AutomationInterval {
    YEAR = 'year',
    MONTH = 'month',
    WEEK = 'week',
    DAY = 'day',
}

export enum AutomationWeekday {
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
}

export type AutomationAction = {
    type: AutomationType;
    value: number | 'default';
    nextRun: Date;
};

export type AutomationConfig = {
    interval: AutomationInterval;
    month?: number;
    day?: number;
    weekday?: AutomationWeekday;
    hour: number;
    minute: number;
    isActive: boolean;
};

export type Automation = {
    counterId: string;
    config: AutomationConfig;
    action: AutomationAction;
};
