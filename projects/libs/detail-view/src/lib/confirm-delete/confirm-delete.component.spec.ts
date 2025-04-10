import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComponent } from './confirm-delete.component';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
} from '@angular/material/dialog';

describe('ConfirmDeleteComponent', () => {
    let component: ConfirmDeleteComponent;
    let fixture: ComponentFixture<ConfirmDeleteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ConfirmDeleteComponent,
                MatButtonModule,
                MatDialogActions,
                MatDialogClose,
                MatDialogTitle,
                MatDialogContent,
                MAT_DIALOG_DATA,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
