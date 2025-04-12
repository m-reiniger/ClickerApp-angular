export type TransactionOperation = 'add' | 'subtract' | 'reset' | 'snapshot';

export interface Transaction {
    operation: TransactionOperation;
    value: number;
    currentValue: number;
    timestamp: Date;
    timeSincePrevious?: string;
}
