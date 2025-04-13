import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-donations',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatCardModule],
    templateUrl: './donations.component.html',
    styleUrl: './donations.component.scss',
})
export class DonationsComponent {
    constructor(private router: Router) {}

    public onClose(): void {
        this.router.navigate(['/']);
    }
}
