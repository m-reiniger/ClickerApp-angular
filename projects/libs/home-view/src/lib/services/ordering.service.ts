import { Injectable, signal, Signal } from '@angular/core';

const ORDER_STORAGE_KEY = 'counter_order';

@Injectable({
    providedIn: 'root',
})
export class OrderingService {
    private order = signal<string[]>([]);

    constructor() {
        this.loadOrder();
    }

    public getOrder(): Signal<string[]> {
        return this.order;
    }

    public updateOrder(previousIndex: number, currentIndex: number): void {
        const currentOrder = [...this.order()];
        const [movedItem] = currentOrder.splice(previousIndex, 1);
        currentOrder.splice(currentIndex, 0, movedItem);
        this.setOrder(currentOrder);
    }

    public addToOrder(id: string): void {
        const currentOrder = [...this.order()];
        if (!currentOrder.includes(id)) {
            currentOrder.push(id);
            this.setOrder(currentOrder);
        }
    }

    public removeFromOrder(id: string): void {
        const currentOrder = this.order().filter((itemId) => itemId !== id);
        this.setOrder(currentOrder);
    }

    public setOrder(newOrder: string[]): void {
        this.order.set(newOrder);
        this.saveOrder();
    }

    private loadOrder(): void {
        const storedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
        if (storedOrder) {
            try {
                this.order.set(JSON.parse(storedOrder));
            } catch (e) {
                console.error('Failed to parse stored order:', e);
                this.order.set([]);
            }
        }
    }

    private saveOrder(): void {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(this.order()));
    }
}
