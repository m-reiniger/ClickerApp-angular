import { Component, inject } from '@angular/core';

import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonTitle,
    IonToolbar,
    ModalController,
} from '@ionic/angular/standalone';

import { hourOptions, minuteOptions } from '@libs/automation-editor-view';

@Component({
    selector: 'lib-time-picker',
    imports: [
        IonHeader,
        IonContent,
        IonButton,
        IonButtons,
        IonPicker,
        IonPickerColumn,
        IonPickerColumnOption,
        IonTitle,
        IonToolbar,
    ],
    templateUrl: './time-picker.component.html',
    styleUrl: './time-picker.component.css',
})
export class TimePickerComponent {
    public hOptions = hourOptions;
    public mOptions = minuteOptions;

    public currentHourValue = 0;
    public currentMinuteValue = 0;

    private modalCtrl = inject(ModalController);

    public onIonChangeHour(event: CustomEvent): void {
        this.currentHourValue = event.detail.value;
    }

    public onIonChangeMinute(event: CustomEvent): void {
        this.currentMinuteValue = event.detail.value;
    }

    public cancel(): Promise<boolean> {
        return this.modalCtrl.dismiss(null, 'cancel');
    }

    public confirm(): Promise<boolean> {
        return this.modalCtrl.dismiss(
            { hour: this.currentHourValue, minute: this.currentMinuteValue },
            'confirm'
        );
    }
}
