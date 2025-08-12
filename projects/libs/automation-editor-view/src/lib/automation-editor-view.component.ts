import { Component, Input, OnInit, output, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';

import { SwipeToCloseDirective } from '@libs/touch-gestures';
import {
    AutomationEditorViewAutomations,
    AutomationEditorViewCounter,
    AutomationEditorViewAutomation,
    AutomationType,
    AutomationInterval,
    AutomationWeekday,
    intervalOptions,
    hourOptions,
    minuteOptions,
    weekdayOptions,
    dayOptions,
    monthOptions,
    actionOptions,
} from '@libs/automation-editor-view';

import { IntervalPickerComponent } from './picker/interval-picker/interval-picker.component';
import { TimePickerComponent } from './picker/time-picker/time-picker.component';
import { WeekdayPickerComponent } from './picker/weekday-picker/weekday-picker.component';
import { DayPickerComponent } from './picker/day-picker/day-picker.component';
import { MonthPickerComponent } from './picker/month-picker/month-picker.component';
import { ActionTypePickerComponent } from './picker/action-type-picker/action-type-picker.component';

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
        IonButton,
        IonIcon,
    ],
    templateUrl: './automation-editor-view.component.html',
    styleUrl: './automation-editor-view.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    public intervalOptions = intervalOptions;
    public weekdayOptions = weekdayOptions;
    public monthOptions = monthOptions;
    public actionOptions = actionOptions;

    private modalCtrl = inject(ModalController);

    constructor(private fb: FormBuilder) {
        this.automationForms = this.fb.array([]);
        this.automationFormGroup = this.fb.group({
            automations: this.automationForms,
        });

        addIcons({ chevronDownOutline });
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
            hour: [
                automation?.config.hour || 0,
                [Validators.required, Validators.min(0), Validators.max(23)],
            ],
            minute: [
                automation?.config.minute || 0,
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            isActive: [automation?.config.isActive ?? true],
            type: [automation?.action.type || AutomationType.INCREMENT, Validators.required],
            value: [
                automation?.action.value || this.getDefaultActionValue(automation?.action.type),
                [Validators.required, this.numberValidator],
            ],
            nextRun: [automation?.action.nextRun || new Date()],
        });

        // Apply conditional validation based on interval
        this.updateFormValidations(form, automation?.config.interval || AutomationInterval.DAY);

        this.automationForms.push(form);
    }

    /**
     * Custom validator to ensure value is a number
     */
    private numberValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value === null || control.value === undefined || control.value === '') {
            return null; // Let required validator handle this
        }

        if (typeof control.value === 'number' && !isNaN(control.value)) {
            return null;
        }

        return { notANumber: true };
    }

    /**
     * Update form validations based on the selected interval
     */
    private updateFormValidations(form: FormGroup, interval: AutomationInterval): void {
        const monthControl = form.get('month');
        const dayControl = form.get('day');
        const weekdayControl = form.get('weekday');

        // Clear all validators first
        monthControl?.clearValidators();
        dayControl?.clearValidators();
        weekdayControl?.clearValidators();

        // Apply validators based on interval
        switch (interval) {
            case AutomationInterval.YEAR:
                monthControl?.setValidators([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(12),
                ]);
                dayControl?.setValidators([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(31),
                ]);
                break;
            case AutomationInterval.MONTH:
                dayControl?.setValidators([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(31),
                ]);
                break;
            case AutomationInterval.WEEK:
                weekdayControl?.setValidators([Validators.required]);
                break;
            case AutomationInterval.DAY:
            default:
                // No additional validators needed for daily
                break;
        }

        // Update validity
        monthControl?.updateValueAndValidity();
        dayControl?.updateValueAndValidity();
        weekdayControl?.updateValueAndValidity();
    }

    // TODO:check if this is needed
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

    /**
     * Interval picker modal
     */
    public async openIntervalPicker(formIndex: number): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: IntervalPickerComponent,
            cssClass: 'picker-modal',
            componentProps: {
                currentValue: this.automationForms.at(formIndex).get('interval')?.value,
            },
            showBackdrop: true,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.onIntervalChange(formIndex, data);
        }
    }

    public onIntervalChange(formIndex: number, value: string): void {
        const form = this.automationForms.at(formIndex) as FormGroup;
        form.get('interval')?.setValue(value);

        // Update validations when interval changes
        this.updateFormValidations(form, value as AutomationInterval);
    }

    /**
     * Time picker modal
     */
    public async openTimePicker(formIndex: number): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: TimePickerComponent,
            cssClass: 'picker-modal',
            componentProps: {
                currentHourValue: this.automationForms.at(formIndex).get('hour')?.value,
                currentMinuteValue: this.automationForms.at(formIndex).get('minute')?.value,
            },
            showBackdrop: true,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.onTimeChange(formIndex, data.hour, data.minute);
        }
    }

    public onTimeChange(formIndex: number, hour: number, minute: number): void {
        const form = this.automationForms.at(formIndex);
        form.get('hour')?.setValue(hour);
        form.get('minute')?.setValue(minute);
    }

    /**
     * Weekday picker modal
     */
    public async openWeekdayPicker(formIndex: number): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: WeekdayPickerComponent,
            cssClass: 'picker-modal',
            componentProps: {
                currentValue: this.automationForms.at(formIndex).get('weekday')?.value,
            },
            showBackdrop: true,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.onWeekdayChange(formIndex, data);
        }
    }

    public onWeekdayChange(formIndex: number, value: string): void {
        const form = this.automationForms.at(formIndex);
        form.get('weekday')?.setValue(value);
    }

    /**
     * Day picker modal
     */
    public async openDayPicker(formIndex: number): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: DayPickerComponent,
            cssClass: 'picker-modal',
            componentProps: {
                currentValue: this.automationForms.at(formIndex).get('day')?.value,
            },
            showBackdrop: true,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.onDayChange(formIndex, data);
        }
    }

    public onDayChange(formIndex: number, value: number): void {
        const form = this.automationForms.at(formIndex);
        form.get('day')?.setValue(value);
    }

    /**
     * Month picker modal
     */
    public async openMonthPicker(formIndex: number): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: MonthPickerComponent,
            cssClass: 'picker-modal',
            componentProps: {
                currentValue: this.automationForms.at(formIndex).get('month')?.value,
            },
            showBackdrop: true,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.onMonthChange(formIndex, data);
        }
    }

    public onMonthChange(formIndex: number, value: number): void {
        const form = this.automationForms.at(formIndex);
        form.get('month')?.setValue(value);
    }

    /**
     * Action type picker modal
     */
    public async openActionTypePicker(formIndex: number): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: ActionTypePickerComponent,
            cssClass: 'picker-modal',
            componentProps: {
                currentValue: this.automationForms.at(formIndex).get('type')?.value,
            },
            showBackdrop: true,
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.onActionTypePickerChange(formIndex, data);
        }
    }

    public onActionTypePickerChange(formIndex: number, value: AutomationType): void {
        const form = this.automationForms.at(formIndex);
        form.get('type')?.setValue(value);
        this.onActionTypeChange(form, value);
    }

    public getDisplayValue(formIndex: number, controlName: string): string {
        const form = this.automationForms.at(formIndex);
        const value = form.get(controlName)?.value;

        switch (controlName) {
            case 'interval':
                return this.intervalOptions.find((opt) => opt.value === value)?.label || 'Interval';
            case 'weekday':
                return this.weekdayOptions.find((opt) => opt.value === value)?.label || 'Weekday';
            case 'month':
                return this.monthOptions.find((opt) => opt.value === value)?.label || 'Month';
            case 'day':
                return dayOptions.find((opt) => opt.value === value)?.label || 'Day';
            case 'hour':
                return hourOptions.find((opt) => opt.value === value)?.label || '00';
            case 'minute':
                return minuteOptions.find((opt) => opt.value === value)?.label || '00';
            case 'time':
                const hour =
                    hourOptions.find((opt) => opt.value === form.get('hour')?.value)?.label || '00';
                const minute =
                    minuteOptions.find((opt) => opt.value === form.get('minute')?.value)?.label ||
                    '00';
                return `${hour}:${minute}`;
            case 'type':
                switch (value) {
                    case AutomationType.RESET:
                        return 'Reset to Initial Value';
                    case AutomationType.INCREMENT:
                        return 'Increment by Value';
                    case AutomationType.SET_VALUE:
                        return 'Set to Value';
                    default:
                        return 'Select Action';
                }
            default:
                return value?.toString() || '';
        }
    }

    // TODO: validate automations before saving
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
