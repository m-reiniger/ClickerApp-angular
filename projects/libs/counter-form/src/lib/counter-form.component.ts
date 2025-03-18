import { Component, Input, OnInit, output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

import { CounterForm } from './types/counter-form.types';

@Component({
    selector: 'counter-form',
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatExpansionModule,
        MatAccordion
    ],
    templateUrl: './counter-form.component.html',
    styleUrl: './counter-form.component.scss'
})
export class CounterFormComponent implements OnInit {

    @Input() title: string = 'Create a new Counter';
    @Input() editCounter: CounterForm | undefined = undefined;

    public counter = output<CounterForm>();
    public closeOverlay = output<string | undefined>();

    public editMode = false;

    public counterForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        defaultIncrement: new FormControl(1, [Validators.required]),
        initialValue: new FormControl(0, [Validators.required]),
    });

    ngOnInit(): void {
        if (this.editCounter && this.editCounter.id) {
            this.counterForm.setValue({
                name: this.editCounter.name,
                defaultIncrement: this.editCounter.defaultIncrement,
                initialValue: 0,
            });
            this.editMode = true;
        }
    }

    public saveCounter() {
        if (this.counterForm.valid) {
            this.counter.emit({
                id: this.editCounter?.id || undefined,
                name: this.counterForm.value.name as string,
                defaultIncrement: this.counterForm.value.defaultIncrement as number,
                initialValue: this.counterForm.value.initialValue as number,
            });
        }
    }

    public close() {
        if (this.editCounter && this.editCounter.id) {
            this.closeOverlay.emit(this.editCounter.id);
        } else {
            this.closeOverlay.emit(undefined);
        }
    }
}
