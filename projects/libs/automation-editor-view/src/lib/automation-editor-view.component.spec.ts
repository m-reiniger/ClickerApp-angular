import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationEditorViewComponent } from './automation-editor-view.component';

describe('AutomationEditorViewComponent', () => {
    let component: AutomationEditorViewComponent;
    let fixture: ComponentFixture<AutomationEditorViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutomationEditorViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AutomationEditorViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
