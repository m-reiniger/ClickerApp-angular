import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import packageJson from '../../../../../../../package.json';
import { SwipeDirective, SwipeUpToCloseComponent } from '@libs/touch-gestures';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatCardModule, SwipeDirective],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
})
export class AboutComponent extends SwipeUpToCloseComponent {
    public version = packageJson.version;
    public scrollContainerId = 'main';

    private router = inject(Router);

    public close(): void {
        this.router.navigate(['/']);
    }
}
