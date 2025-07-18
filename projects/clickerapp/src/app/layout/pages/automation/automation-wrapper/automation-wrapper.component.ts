import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    AutomationEditorViewAutomations,
    AutomationEditorViewComponent,
    AutomationEditorViewCounter,
} from '@libs/automation-editor-view';

import { AutomationService } from '@app/core/automation/automation.service';
import { CounterService } from '@app/core/counter/counter.service';

@Component({
    selector: 'app-automation-wrapper',
    imports: [AutomationEditorViewComponent],
    templateUrl: './automation-wrapper.component.html',
    styleUrl: './automation-wrapper.component.scss',
})
export class AutomationWrapperComponent implements OnInit {
    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);
    private automationService = inject(AutomationService);
    private router = inject(Router);

    public editCounter: AutomationEditorViewCounter | undefined = undefined;
    public automations: AutomationEditorViewAutomations = [];

    public ngOnInit(): void {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        if (counterId) {
            const counter$ = this.counterService.getCounter$(counterId);
            if (counter$) {
                this.editCounter = {
                    id: counter$().id,
                    name: counter$().name,
                    defaultIncrement: counter$().defaultIncrement,
                    initialValue: counter$().initialValue,
                };
            }
        }

        if (this.editCounter?.id) {
            const automations = this.automationService.getAutomations(this.editCounter.id);
            if (automations) {
                this.automations = automations.map((automation) => ({
                    id: automation.id,
                    counterId: automation.counterId,
                    config: automation.config,
                    action: automation.action,
                }));
            }
        }
    }

    // public saveAutomations(automations: AutomationEditorViewAutomations): void {
    //     console.log('automations', automations);
    // }

    public closeOverlay(): void {
        this.router.navigate(['detail', this.editCounter?.id]);
    }
}
