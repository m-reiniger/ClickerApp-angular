import { Component, Input, OnInit, output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { SwipeToCloseDirective } from '@libs/touch-gestures';

import { EditorViewCounter } from './types/editor-view.types';

interface ColorOption {
    name: string;
    value: string;
}

/**
 * Form component for creating and editing counters.
 *
 * @Input title - The title to display at the top of the form (default: 'Create a new Counter')
 * @Input editCounter - Optional counter data to edit. If provided, the form will be pre-filled with counter data
 *
 * @Output counter - Emits the form data when the counter is saved
 * @Output closeOverlay - Emits the counter ID when the form is closed, or undefined if creating a new counter
 */
@Component({
    selector: 'lib-editor-view',
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
        SwipeToCloseDirective,
    ],
    templateUrl: './editor-view.component.html',
    styleUrl: './editor-view.component.scss',
})
export class EditorViewComponent implements OnInit {
    @Input() public title = 'Create a new Counter';
    @Input() public editCounter: EditorViewCounter | undefined = undefined;

    public counter = output<EditorViewCounter>();
    public closeOverlay = output<string | undefined>();

    public editMode = false;
    public selectedColor = 'var(--counter-default)';

    public colorOptions: ColorOption[] = [
        { name: 'Default', value: 'var(--counter-default)' },
        { name: 'Blue', value: 'var(--counter-blue)' },
        { name: 'Green', value: 'var(--counter-green)' },
        { name: 'Purple', value: 'var(--counter-purple)' },
        { name: 'Red', value: 'var(--counter-red)' },
        { name: 'Yellow', value: 'var(--counter-yellow)' },
        { name: 'Orange', value: 'var(--counter-orange)' },
        { name: 'Pink', value: 'var(--counter-pink)' },
        { name: 'Cyan', value: 'var(--counter-cyan)' },
        { name: 'Gray', value: 'var(--counter-gray)' },
    ];

    public counterForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        defaultIncrement: new FormControl(1, [Validators.required]),
        initialValue: new FormControl(0, [Validators.required]),
        goal: new FormControl<number | null>(null),
    });

    public ngOnInit(): void {
        if (this.editCounter && this.editCounter.id) {
            this.title = 'Edit Counter';
            this.counterForm.setValue({
                name: this.editCounter.name,
                defaultIncrement: this.editCounter.defaultIncrement,
                initialValue: 0,
                goal: this.editCounter.goal ? this.editCounter.goal : null,
            });
            this.editMode = true;
        }
    }

    public selectColor(color: string): void {
        this.selectedColor = color;
    }

    public saveCounter(): void {
        if (this.counterForm.valid) {
            this.counter.emit({
                id: this.editCounter?.id || undefined,
                name: this.counterForm.value.name as string,
                defaultIncrement: this.counterForm.value.defaultIncrement as number,
                initialValue: this.counterForm.value.initialValue as number,
                goal: this.counterForm.value.goal,
                color: this.selectedColor,
            });
        }
    }

    public close(): void {
        if (this.editCounter && this.editCounter.id) {
            this.closeOverlay.emit(this.editCounter.id);
        } else {
            this.closeOverlay.emit(undefined);
        }
    }
}
