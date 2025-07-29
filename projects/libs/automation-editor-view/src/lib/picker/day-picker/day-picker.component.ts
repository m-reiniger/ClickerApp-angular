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

import { dayOptions } from '../../types/automation-editor-view.types';

@Component({
    selector: 'lib-day-picker',
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
    templateUrl: './day-picker.component.html',
    styleUrl: './day-picker.component.css',
})
export class DayPickerComponent {
    public options = dayOptions;
    public currentValue = 0;

    private modalCtrl = inject(ModalController);

    public onIonChange(event: CustomEvent): void {
        this.currentValue = event.detail.value;
    }

    public cancel(): Promise<boolean> {
        return this.modalCtrl.dismiss(null, 'cancel');
    }

    public confirm(): Promise<boolean> {
        return this.modalCtrl.dismiss(this.currentValue, 'confirm');
    }
}
