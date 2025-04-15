import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    Output,
} from '@angular/core';

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
    @Input() public swipeThreshold = 175;
    @Output() public swipe = new EventEmitter<{ direction: SwipeDirection; amount: number }>();
    @Output() public swipeState = new EventEmitter<{
        isSwiping: boolean;
        direction?: SwipeDirection;
        amount?: number;
    }>();

    private touchStartX = 0;
    private touchStartY = 0;
    private lastTouchX = 0;
    private lastTouchY = 0;
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
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;

        // Determine the primary direction of the swipe
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

            this.swipeState.emit({
                isSwiping: true,
                direction: this.currentDirection,
                amount:
                    this.currentDirection === SwipeDirection.Up ||
                    this.currentDirection === SwipeDirection.Down
                        ? Math.abs(deltaY)
                        : Math.abs(deltaX),
            });
        }
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: TouchEvent): void {
        event.stopPropagation();

        const deltaX = Math.abs(this.touchStartX - this.lastTouchX);
        const deltaY = Math.abs(this.touchStartY - this.lastTouchY);

        if (
            this.isSwiping &&
            this.currentDirection &&
            (deltaX > this.swipeThreshold || deltaY > this.swipeThreshold)
        ) {
            this.swipe.emit({
                direction: this.currentDirection,
                amount:
                    this.currentDirection === SwipeDirection.Up ||
                    this.currentDirection === SwipeDirection.Down
                        ? Math.abs(deltaY)
                        : Math.abs(deltaX),
            });
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
