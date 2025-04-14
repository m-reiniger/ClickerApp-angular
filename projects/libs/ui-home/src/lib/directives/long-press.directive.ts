import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type PressType = 'click' | 'longpress';

@Directive({
    selector: '[libLongPress]',
    standalone: true,
})
export class LongPressDirective {
    @Output() public press = new EventEmitter<PressType>();
    @Output() public pressState = new EventEmitter<boolean>();
    private pressTimer: ReturnType<typeof setTimeout> | undefined;
    private readonly LONG_PRESS_DURATION = 500; // 500ms for long press
    private touchStartTime = 0;

    constructor(private elementRef: ElementRef) {}

    @HostListener('touchstart', ['$event'])
    public onTouchStart(): void {
        this.touchStartTime = Date.now();
        this.startPress();
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(): void {
        this.touchStartTime = Date.now();
        this.startPress();
    }

    @HostListener('touchend')
    public onTouchEnd(): void {
        this.endPress();
    }

    @HostListener('mouseup')
    public onMouseUp(): void {
        this.endPress();
    }

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        this.endPress();
    }

    @HostListener('touchcancel')
    public onTouchCancel(): void {
        this.endPress();
    }

    private async startPress(): Promise<void> {
        // Emit press start
        this.pressState.emit(true);

        this.pressTimer = setTimeout(async () => {
            // Trigger haptic feedback using Capacitor Haptics
            await Haptics.impact({ style: ImpactStyle.Medium });

            // Emit long press event
            this.press.emit('longpress');
        }, this.LONG_PRESS_DURATION);
    }

    private endPress(): void {
        if (this.pressTimer) {
            clearTimeout(this.pressTimer);
            this.pressTimer = undefined;

            // If the press was shorter than the long press duration, emit click
            if (Date.now() - this.touchStartTime < this.LONG_PRESS_DURATION) {
                this.press.emit('click');
            }
        }
        // Emit press end
        this.pressState.emit(false);
    }
}
