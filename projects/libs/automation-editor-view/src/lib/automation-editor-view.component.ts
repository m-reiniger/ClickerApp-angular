import { Component, Input, OnInit, output } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SwipeToCloseDirective } from '@libs/touch-gestures';
import {
    AutomationEditorViewAutomations,
    AutomationEditorViewCounter,
    AutomationEditorViewAutomation,
    AutomationType,
    AutomationInterval,
    AutomationWeekday,
} from '@libs/automation-editor-view';

@Component({
    selector: 'lib-automation-editor-view',
    imports: [
        MatCardModule,
        MatButtonModule,
        SwipeToCloseDirective,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './automation-editor-view.component.html',
    styleUrl: './automation-editor-view.component.css',
})
export class AutomationEditorViewComponent implements OnInit {
    @Input() public title = 'Configure Automations';
    @Input() public editCounter: AutomationEditorViewCounter | undefined = undefined;
    @Input() public automations: AutomationEditorViewAutomations = [];

    public automationsToSave = output<AutomationEditorViewAutomations>();
    public closeOverlay = output<void>();

    public automationForms: FormArray;
    public automationFormGroup: FormGroup;
    public automationType = AutomationType;
    public automationInterval = AutomationInterval;
    public automationWeekday = AutomationWeekday;

    public intervalOptions = [
        { value: AutomationInterval.DAY, label: 'Daily' },
        { value: AutomationInterval.WEEK, label: 'Weekly' },
        { value: AutomationInterval.MONTH, label: 'Monthly' },
        { value: AutomationInterval.YEAR, label: 'Yearly' },
    ];

    public weekdayOptions = [
        { value: AutomationWeekday.SUNDAY, label: 'Sunday' },
        { value: AutomationWeekday.MONDAY, label: 'Monday' },
        { value: AutomationWeekday.TUESDAY, label: 'Tuesday' },
        { value: AutomationWeekday.WEDNESDAY, label: 'Wednesday' },
        { value: AutomationWeekday.THURSDAY, label: 'Thursday' },
        { value: AutomationWeekday.FRIDAY, label: 'Friday' },
        { value: AutomationWeekday.SATURDAY, label: 'Saturday' },
    ];

    public monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    public dayOptions = Array.from({ length: 31 }, (_, i) => ({
        value: i + 1,
        label: (i + 1).toString(),
    }));
    public hourOptions = Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, '0'),
    }));
    public minuteOptions = Array.from({ length: 60 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, '0'),
    }));

    constructor(private fb: FormBuilder) {
        this.automationForms = this.fb.array([]);
        this.automationFormGroup = this.fb.group({
            automations: this.automationForms,
        });
    }

    public ngOnInit(): void {
        this.initializeForms();
    }

    private initializeForms(): void {
        this.automationForms.clear();

        if (this.automations && this.automations.length > 0) {
            this.automations.forEach((automation) => {
                this.addAutomationForm(automation);
            });
        } else {
            this.addAutomationForm();
        }
    }

    private addAutomationForm(automation?: AutomationEditorViewAutomation): void {
        const form = this.fb.group({
            id: [automation?.id || this.generateId()],
            counterId: [this.editCounter?.id || ''],
            interval: [automation?.config.interval || AutomationInterval.DAY, Validators.required],
            month: [automation?.config.month || null],
            day: [automation?.config.day || null],
            weekday: [automation?.config.weekday || null],
            hour: [automation?.config.hour || 0, Validators.required],
            minute: [automation?.config.minute || 0, Validators.required],
            isActive: [automation?.config.isActive ?? true],
            type: [automation?.action.type || AutomationType.INCREMENT, Validators.required],
            value: [
                automation?.action.value || this.getDefaultActionValue(automation?.action.type),
            ],
            nextRun: [automation?.action.nextRun || new Date()],
        });

        this.automationForms.push(form);
    }

    private generateId(): string {
        return 'automation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    private getDefaultActionValue(type?: AutomationType): number | 'default' {
        switch (type) {
            case AutomationType.RESET:
                return this.editCounter?.initialValue || 0;
            case AutomationType.INCREMENT:
                return this.editCounter?.defaultIncrement || 1;
            case AutomationType.SET_VALUE:
                return 0;
            default:
                return this.editCounter?.defaultIncrement || 1;
        }
    }

    public addNewAutomation(): void {
        const lastForm = this.automationForms.at(this.automationForms.length - 1);
        if (lastForm && lastForm.valid) {
            this.addAutomationForm();
        }
    }

    // TODO: handle automation removal
    public removeAutomation(index: number): void {
        this.automationForms.removeAt(index);
    }

    public onActionTypeChange(form: AbstractControl, type: AutomationType): void {
        const valueControl = form.get('value');

        switch (type) {
            case AutomationType.RESET:
                valueControl?.setValue(this.editCounter?.initialValue || 0);
                valueControl?.disable();
                break;
            case AutomationType.INCREMENT:
                valueControl?.setValue(this.editCounter?.defaultIncrement || 1);
                valueControl?.enable();
                break;
            case AutomationType.SET_VALUE:
                valueControl?.setValue(0);
                valueControl?.enable();
                break;
        }
    }

    public saveAutomations(): void {
        const now = new Date();
        now.setHours(now.getHours() + 1, now.getMinutes(), 0, 0);
        if (this.automationForms.valid) {
            const automations: AutomationEditorViewAutomations = this.automationForms.controls.map(
                (form) => {
                    const formValue = form.value;
                    return {
                        id: formValue.id,
                        counterId: formValue.counterId,
                        config: {
                            interval: formValue.interval,
                            month: formValue.month,
                            day: formValue.day,
                            weekday: formValue.weekday,
                            hour: formValue.hour,
                            minute: formValue.minute,
                            isActive: formValue.isActive,
                        },
                        action: {
                            type: formValue.type,
                            value: formValue.value,
                            nextRun: now,
                        },
                    } as AutomationEditorViewAutomation;
                }
            );

            this.automationsToSave.emit(automations);
            this.close();
        }
    }

    public close(): void {
        this.closeOverlay.emit();
    }
}
