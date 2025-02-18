import { Component, Input, output } from '@angular/core';
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
export class CounterFormComponent {

    @Input() title: string = 'Create a new Counter';
    public counter = output<CounterForm>();
    public closeOverlay = output<void>();

    public counterForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        defaultIncrement: new FormControl(1, [Validators.required]),
        initialValue: new FormControl(0, [Validators.required]),
    });

    public createCounter() {
        if (this.counterForm.valid) {
            this.counter.emit({
                name: this.counterForm.value.name as string,
                defaultIncrement: this.counterForm.value.defaultIncrement as number,
                initialValue: this.counterForm.value.initialValue as number,
            });
        }
    }

    public close() {
        this.closeOverlay.emit();
    }
}
