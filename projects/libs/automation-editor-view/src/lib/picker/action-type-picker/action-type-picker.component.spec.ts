import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTypePickerComponent } from './action-type-picker.component';

describe('ActionTypePickerComponent', () => {
    let component: ActionTypePickerComponent;
    let fixture: ComponentFixture<ActionTypePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ActionTypePickerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ActionTypePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
