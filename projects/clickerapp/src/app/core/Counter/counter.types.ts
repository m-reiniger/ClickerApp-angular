import { TransactionOperation, Transactions } from '../transaction/transaction.type';

export type Counters = Array<Counter>;

export type Counter = {
    id: string;
    name: string;
    transactions: Transactions;
    defaultIncrement: number;
    defaultOperation: TransactionOperation;
};
