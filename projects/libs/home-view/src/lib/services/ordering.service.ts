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

        // Make sure we have valid indices
        if (
            previousIndex < 0 ||
            previousIndex >= currentOrder.length ||
            currentIndex < 0 ||
            currentIndex >= currentOrder.length
        ) {
            return;
        }

        // Move the item
        const [movedItem] = currentOrder.splice(previousIndex, 1);
        currentOrder.splice(currentIndex, 0, movedItem);

        // Update the order
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
        // Filter out any null or undefined values
        const cleanOrder = newOrder.filter((id) => id != null);
        this.order.set(cleanOrder);
        this.saveOrder();
    }

    private loadOrder(): void {
        const storedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
        if (storedOrder) {
            try {
                const parsedOrder = JSON.parse(storedOrder);
                // Filter out any null or undefined values
                const cleanOrder = parsedOrder.filter((id: string) => id != null);
                this.order.set(cleanOrder);
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
