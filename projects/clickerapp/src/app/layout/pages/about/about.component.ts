import { Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../../../../../../package.json';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatCardModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
})
export class AboutComponent {
    public version = packageJson.version;

    constructor(private router: Router) {}

    public onClose(): void {
        this.router.navigate(['/']);
    }
}
