import { Component, output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { CounterForm } from './types/counter-form.types';

@Component({
    selector: 'counter-form',
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ],
    templateUrl: './counter-form.component.html',
    styleUrl: './counter-form.component.scss'
})
export class CounterFormComponent {

    public counter = output<CounterForm>();

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
}
