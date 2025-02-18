import { Component, Input, Signal, signal } from '@angular/core';

import { CounterDetail } from './types/counter-detail.types';

@Component({
    selector: 'detail-view',
    imports: [],
    templateUrl: './detail-view.component.html',
    styleUrl: './detail-view.component.scss'
})
export class DetailViewComponent {

    @Input() counterDetail: Signal<CounterDetail | undefined> = signal<CounterDetail | undefined>(undefined);
    @Input() counterValue: Signal<number> = signal(0);

}
