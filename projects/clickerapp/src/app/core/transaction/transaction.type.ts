export type Transactions = Array<Transaction>;

export type Transaction = {
    value: number;
    created: Date;
    operation: TransactionOperation;
};

export enum TransactionOperation {
    ADD,
    SUBTRACT,
    RESET,
    SNAPSHOT,
    AUTOMATION,
}
