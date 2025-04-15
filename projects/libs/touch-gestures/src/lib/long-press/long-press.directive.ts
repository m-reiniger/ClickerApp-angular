import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export enum PressType {
    Click = 'click',
    LongPress = 'longpress',
}

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

    private hasEmitted = false;

    private elementRef = inject(ElementRef);

    @HostListener('touchstart', ['$event'])
    public onTouchStart(event: TouchEvent): void {
        event.stopPropagation();
        this.touchStartTime = Date.now();
        this.startPress();
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        event.stopPropagation();
        this.touchStartTime = Date.now();
        // this.startPress();
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: TouchEvent): void {
        event.stopPropagation();
        this.endPress();
    }

    @HostListener('mouseup', ['$event'])
    public onMouseUp(event: MouseEvent): void {
        event.stopPropagation();
        // this.endPress();
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseLeave(event: MouseEvent): void {
        event.stopPropagation();
        // this.endPress();
    }

    @HostListener('touchcancel', ['$event'])
    public onTouchCancel(event: TouchEvent): void {
        event.stopPropagation();
        // this.endPress();
    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    private startPress(): void {
        // Emit press start
        this.hasEmitted = false;
        this.pressState.emit(true);
        this.pressTimer = setTimeout(async () => {
            Haptics.impact({ style: ImpactStyle.Medium });
            // Emit long press event
            if (!this.hasEmitted) {
                this.hasEmitted = true;
                this.press.emit(PressType.LongPress);
            }
            // Trigger haptic feedback using Capacitor Haptics
        }, this.LONG_PRESS_DURATION);
    }

    private endPress(): void {
        if (this.pressTimer) {
            clearTimeout(this.pressTimer);
            this.pressTimer = undefined;

            // If we cleared the timer before it triggered, emit click
            if (!this.hasEmitted && Date.now() - this.touchStartTime < this.LONG_PRESS_DURATION) {
                this.hasEmitted = true;
                this.press.emit(PressType.Click);
            }
        }
        // Emit press end
        this.pressState.emit(false);
    }
}
