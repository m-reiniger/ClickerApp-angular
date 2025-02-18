import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { CounterService } from '@app/core/counter/counter.service';
import { MainMenuComponent } from '@app/layout/ui-components/main-menu/main-menu.component';


@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatIconModule,
        MainMenuComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    constructor(private counterService: CounterService) { }

    public ngOnInit() {
        // TODO: clean up
    }
}