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

import { weekdayOptions } from '../../types/automation-editor-view.types';

@Component({
    selector: 'lib-weekday-picker',
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
    templateUrl: './weekday-picker.component.html',
    styleUrl: './weekday-picker.component.css',
})
export class WeekdayPickerComponent {
    public options = weekdayOptions;
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
