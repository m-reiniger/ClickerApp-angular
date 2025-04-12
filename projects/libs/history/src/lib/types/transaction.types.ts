export type TransactionOperation = 'add' | 'subtract' | 'reset' | 'snapshot';

export interface Transaction {
    id: string;
    operation: TransactionOperation;
    value: number;
    currentValue: number;
    timestamp: Date;
    timeSincePrevious?: string;
}
