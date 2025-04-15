import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

export enum SwipeDirection {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right',
}

@Directive({
    selector: '[libSwipe]',
    standalone: true,
})
export class SwipeDirective {
    @Output() public swipe = new EventEmitter<SwipeDirection>();
    @Output() public swipeState = new EventEmitter<{
        isSwiping: boolean;
        direction?: SwipeDirection;
    }>();

    private touchStartX = 0;
    private touchStartY = 0;
    private isSwiping = false;
    private currentDirection: SwipeDirection | undefined;

    private elementRef = inject(ElementRef);

    @HostListener('touchstart', ['$event'])
    public onTouchStart(event: TouchEvent): void {
        event.stopPropagation();
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.isSwiping = false;
        this.currentDirection = undefined;
    }

    @HostListener('touchmove', ['$event'])
    public onTouchMove(event: TouchEvent): void {
        event.stopPropagation();
        if (!this.touchStartX || !this.touchStartY) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Determine the primary direction of the swipe
        if (!this.isSwiping) {
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            // Only consider it a swipe if the movement is significant enough
            if (absDeltaX > 10 || absDeltaY > 10) {
                this.isSwiping = true;

                if (absDeltaX > absDeltaY) {
                    this.currentDirection = deltaX > 0 ? SwipeDirection.Right : SwipeDirection.Left;
                } else {
                    this.currentDirection = deltaY > 0 ? SwipeDirection.Down : SwipeDirection.Up;
                }

                this.swipeState.emit({ isSwiping: true, direction: this.currentDirection });
            }
        }
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: TouchEvent): void {
        event.stopPropagation();
        if (this.isSwiping && this.currentDirection) {
            this.swipe.emit(this.currentDirection);
        }
        this.swipeState.emit({ isSwiping: false });
        this.resetSwipe();
    }

    @HostListener('touchcancel', ['$event'])
    public onTouchCancel(event: TouchEvent): void {
        event.stopPropagation();
        this.swipeState.emit({ isSwiping: false });
        this.resetSwipe();
    }

    private resetSwipe(): void {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isSwiping = false;
        this.currentDirection = undefined;
    }
}
