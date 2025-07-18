import { Component, Input, output } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SwipeToCloseDirective } from '@libs/touch-gestures';
import {
    AutomationEditorViewAutomations,
    AutomationEditorViewCounter,
} from '@libs/automation-editor-view';

@Component({
    selector: 'lib-automation-editor-view',
    imports: [MatCardModule, MatButtonModule, SwipeToCloseDirective, MatIconModule, JsonPipe],
    templateUrl: './automation-editor-view.component.html',
    styleUrl: './automation-editor-view.component.css',
})
export class AutomationEditorViewComponent {
    @Input() public title = 'Configure Automations';
    @Input() public editCounter: AutomationEditorViewCounter | undefined = undefined;
    @Input() public automations: AutomationEditorViewAutomations = [];

    public automationsToSave = output<AutomationEditorViewAutomations>();

    public closeOverlay = output<void>();

    public close(): void {
        this.closeOverlay.emit();
    }
}
