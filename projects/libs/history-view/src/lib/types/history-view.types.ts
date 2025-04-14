export type HistoryViewTransactionOperation = 'add' | 'subtract' | 'reset' | 'snapshot';

export interface HistoryViewTransaction {
    operation: HistoryViewTransactionOperation;
    value: number;
    currentValue: number;
    timestamp: Date;
    timeSincePrevious?: string;
}
