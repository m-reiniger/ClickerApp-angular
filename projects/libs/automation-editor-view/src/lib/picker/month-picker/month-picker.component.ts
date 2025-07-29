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

import { monthOptions } from '../../types/automation-editor-view.types';

@Component({
    selector: 'lib-month-picker',
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
    templateUrl: './month-picker.component.html',
    styleUrl: './month-picker.component.css',
})
export class MonthPickerComponent {
    public options = monthOptions;
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
