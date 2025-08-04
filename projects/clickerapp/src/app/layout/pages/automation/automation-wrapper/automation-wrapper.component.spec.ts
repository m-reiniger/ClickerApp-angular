import { MockProvider } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ModalController } from '@ionic/angular/standalone';

import { AutomationWrapperComponent } from './automation-wrapper.component';

describe('AutomationWrapperComponent', () => {
    let component: AutomationWrapperComponent;
    let fixture: ComponentFixture<AutomationWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutomationWrapperComponent],
            providers: [
                provideAnimations(),
                provideAnimationsAsync(),
                provideNoopAnimations(),
                provideRouter([]),
                MockProvider(ModalController),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AutomationWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
