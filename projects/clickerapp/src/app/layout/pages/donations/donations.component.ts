import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { SwipeupToCloseDirective } from '@libs/touch-gestures';

@Component({
    selector: 'app-donations',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatCardModule, SwipeupToCloseDirective],
    templateUrl: './donations.component.html',
    styleUrl: './donations.component.scss',
})
export class DonationsComponent {
    constructor(private router: Router) {}

    public close(): void {
        this.router.navigate(['/']);
    }
}
