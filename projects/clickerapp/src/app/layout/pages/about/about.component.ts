import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import packageJson from '../../../../../../../package.json';
import { SwipeToCloseDirective } from '@libs/touch-gestures';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatCardModule, SwipeToCloseDirective],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
})
export class AboutComponent {
    public version = packageJson.version;

    private router = inject(Router);

    public close(): void {
        this.router.navigate(['/']);
    }
}
