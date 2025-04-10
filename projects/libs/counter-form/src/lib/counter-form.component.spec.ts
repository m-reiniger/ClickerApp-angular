import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MockProvider } from 'ng-mocks';

import { CounterFormComponent } from './counter-form.component';

describe('CounterFormComponent', () => {
    let component: CounterFormComponent;
    let fixture: ComponentFixture<CounterFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CounterFormComponent],
            providers: [
                provideAnimations(),
                provideAnimationsAsync(),
                provideNoopAnimations(),
                MockProvider(ActivatedRoute),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CounterFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
