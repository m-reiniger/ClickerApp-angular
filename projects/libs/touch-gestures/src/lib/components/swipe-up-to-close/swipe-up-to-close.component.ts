import { Component, ElementRef, ViewChild } from '@angular/core';
import { SwipeDirection } from '@libs/touch-gestures';

@Component({
    selector: 'lib-swipe-up-to-close',
    imports: [],
    template: '',
})
export abstract class SwipeUpToCloseComponent {
    @ViewChild('swipeUpToClose', { read: ElementRef }) public element!: ElementRef<HTMLElement>;

    protected ANIMATION_DURATION = 300; // ms

    public abstract scrollContainerId: string;
    public abstract close(): void;

    public onSwipe(swipe: { direction: SwipeDirection; amount: number }): void {
        if (swipe.direction === SwipeDirection.Up) {
            this.handleSwipeUp(this.element, swipe.amount);
        }
    }

    public onSwipeStateChange(state: {
        isSwiping: boolean;
        direction?: SwipeDirection;
        amount?: number;
    }): void {
        if (!this.element) return;

        const isScrolledToBottom = this.isScrolledToBottom(
            document.getElementById(this.scrollContainerId)
        );
        if (isScrolledToBottom && state.isSwiping && state.direction === SwipeDirection.Up) {
            this.element.nativeElement.style.marginTop = `-${state.amount}px`;
        } else if (!state.isSwiping) {
            setTimeout(() => {
                this.resetSwipeStyleChanges();
            }, this.ANIMATION_DURATION);
        }
    }

    private resetSwipeStyleChanges(): void {
        this.element.nativeElement.style.marginTop = '';
    }

    private handleSwipeUp(element: ElementRef<HTMLElement>, swipeAmount?: number): void {
        if (!element || !this.isScrolledToBottom(document.getElementById(this.scrollContainerId)))
            return;

        element.nativeElement.style.transform = `translateY(-${swipeAmount}%)`;
        element.nativeElement.style.transition = `transform ${this.ANIMATION_DURATION}ms ease-out`;
        element.nativeElement.style.transform = `translateY(-${swipeAmount}%)`;

        setTimeout(() => {
            this.close();
        }, this.ANIMATION_DURATION);
    }

    private isScrolledToBottom(element: HTMLElement | null): boolean {
        if (!element) return true;

        return element.scrollHeight - element.scrollTop === element.clientHeight;
    }
}
