import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationWrapperComponent } from './automation-wrapper.component';

describe('AutomationWrapperComponent', () => {
    let component: AutomationWrapperComponent;
    let fixture: ComponentFixture<AutomationWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutomationWrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AutomationWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
