import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { EditorWrapperComponent } from './editor-wrapper.component';

describe('EditorWrapperComponent', () => {
    let component: EditorWrapperComponent;
    let fixture: ComponentFixture<EditorWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorWrapperComponent],
            providers: [
                provideAnimations(),
                provideAnimationsAsync(),
                provideNoopAnimations(),
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditorWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the Create Library Wrapper', () => {
        expect(component).toBeTruthy();
    });
});
