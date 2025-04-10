import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHomeComponent } from './ui-home.component';

describe('UiHomeComponent', () => {
    let component: UiHomeComponent;
    let fixture: ComponentFixture<UiHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiHomeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UiHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('getProgress', () => {
        // Basic progression tests
        it('should return "360deg" when no goal is set', () => {
            expect(component.getProgress(0, null, 50)).toBe('360deg');
            expect(component.getProgress(0, undefined, 50)).toBe('360deg');
        });

        it('should return "360deg" when goal equals initial value', () => {
            expect(component.getProgress(100, 100, 150)).toBe('360deg');
        });

        it('should return "180deg" at halfway to goal', () => {
            expect(component.getProgress(0, 100, 50)).toBe('180deg');
        });

        it('should return "360deg" at goal', () => {
            expect(component.getProgress(0, 100, 100)).toBe('360deg');
        });

        // Negative value tests
        it('should handle negative to positive progression', () => {
            expect(component.getProgress(-100, 100, 0)).toBe('180deg');
        });

        it('should handle positive to negative progression', () => {
            expect(component.getProgress(100, -100, 0)).toBe('180deg');
        });

        // Zero goal tests
        it('should handle progression towards zero', () => {
            expect(component.getProgress(100, 0, 50)).toBe('180deg');
        });

        it('should handle progression from zero', () => {
            expect(component.getProgress(0, -100, -50)).toBe('180deg');
        });

        // Moving away from goal tests
        it('should return "0deg" when moving away from positive goal', () => {
            expect(component.getProgress(0, 100, -50)).toBe('0deg');
        });

        it('should return "0deg" when moving away from negative goal', () => {
            expect(component.getProgress(0, -100, 50)).toBe('0deg');
        });

        // Exceeding goal tests
        it('should return "360deg" when exceeding positive goal', () => {
            expect(component.getProgress(0, 100, 150)).toBe('360deg');
        });

        it('should return "360deg" when exceeding negative goal', () => {
            expect(component.getProgress(0, -100, -150)).toBe('360deg');
        });

        // Decimal value tests
        it('should handle decimal values', () => {
            expect(component.getProgress(0, 1, 0.5)).toBe('180deg');
        });

        it('should handle mixed decimal and integer values', () => {
            expect(component.getProgress(0.5, 100.5, 50.5)).toBe('180deg');
        });
    });
});
