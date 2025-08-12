import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    AutomationEditorViewAutomation,
    AutomationEditorViewAutomations,
    AutomationEditorViewComponent,
    AutomationEditorViewCounter,
} from '@libs/automation-editor-view';

import { AutomationService } from '@app/core/automation/automation.service';
import { CounterService } from '@app/core/counter/counter.service';
import { Automation } from '@app/core/automation/automation.type';

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
                this.automations = automations.map((automation) => {
                    return structuredClone(automation) as AutomationEditorViewAutomation;
                });
            }
        }
    }

    public saveAutomations(automations: AutomationEditorViewAutomations): void {
        if (automations.length > 0) {
            const automationsToSave = automations.map((automation) => {
                return structuredClone(automation) as Automation;
            });
            this.automationService.saveAutomations(automationsToSave);
        }
    }

    public deleteAutomation(id: string): void {
        this.automationService.deleteAutomation(id);
    }

    public closeOverlay(): void {
        this.router.navigate(['detail', this.editCounter?.id]);
    }
}
