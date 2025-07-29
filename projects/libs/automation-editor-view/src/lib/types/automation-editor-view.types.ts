export type AutomationEditorViewCounter = {
    id: string;
    name: string;
    defaultIncrement: number;
    initialValue: number;
};

export type AutomationEditorViewAutomations = AutomationEditorViewAutomation[];

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

export type AutomationEditorViewAutomation = {
    id: string;
    counterId: string;
    config: AutomationConfig;
    action: AutomationAction;
};

export const intervalOptions = [
    { value: AutomationInterval.DAY, label: 'Daily' },
    { value: AutomationInterval.WEEK, label: 'Weekly' },
    { value: AutomationInterval.MONTH, label: 'Monthly' },
    { value: AutomationInterval.YEAR, label: 'Yearly' },
];

export const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0'),
}));
export const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0'),
}));

export const weekdayOptions = [
    { value: AutomationWeekday.SUNDAY, label: 'Sunday' },
    { value: AutomationWeekday.MONDAY, label: 'Monday' },
    { value: AutomationWeekday.TUESDAY, label: 'Tuesday' },
    { value: AutomationWeekday.WEDNESDAY, label: 'Wednesday' },
    { value: AutomationWeekday.THURSDAY, label: 'Thursday' },
    { value: AutomationWeekday.FRIDAY, label: 'Friday' },
    { value: AutomationWeekday.SATURDAY, label: 'Saturday' },
];

export const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
}));

export const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

export const actionOptions = [
    { value: AutomationType.RESET, label: 'Reset to Initial Value' },
    { value: AutomationType.INCREMENT, label: 'Increment by Value' },
    { value: AutomationType.SET_VALUE, label: 'Set to Value' },
];
