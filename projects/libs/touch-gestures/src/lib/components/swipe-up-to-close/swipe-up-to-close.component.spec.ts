import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeUpToCloseComponent } from './swipe-up-to-close.component';

describe('SwipeUpToCloseComponent', () => {
    let component: SwipeUpToCloseComponent;
    let fixture: ComponentFixture<SwipeUpToCloseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SwipeUpToCloseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SwipeUpToCloseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
