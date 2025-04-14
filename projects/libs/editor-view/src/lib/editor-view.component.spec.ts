import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MockProvider } from 'ng-mocks';

import { EditorViewComponent } from './editor-view.component';

describe('EditorViewComponent', () => {
    let component: EditorViewComponent;
    let fixture: ComponentFixture<EditorViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorViewComponent],
            providers: [
                provideAnimations(),
                provideAnimationsAsync(),
                provideNoopAnimations(),
                MockProvider(ActivatedRoute),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditorViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
