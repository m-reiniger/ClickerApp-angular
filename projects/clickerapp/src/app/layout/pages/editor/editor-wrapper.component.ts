import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EditorViewCounter, EditorViewComponent } from '@libs/editor-view';

import { CounterService } from '@app/core/counter/counter.service';
import { TransactionOperation } from '@app/core/transaction/transaction.type';

@Component({
    selector: 'app-editor-wrapper',
    imports: [EditorViewComponent],
    templateUrl: './editor-wrapper.component.html',
    styleUrl: './editor-wrapper.component.scss',
})
export class EditorWrapperComponent implements OnInit {
    public editCounter: EditorViewCounter | undefined = undefined;

    private activatedRoute = inject(ActivatedRoute);
    private counterService = inject(CounterService);
    private router = inject(Router);

    public ngOnInit(): void {
        const counterId = this.activatedRoute.snapshot.params['counterId'];
        if (counterId) {
            const counter$ = this.counterService.getCounter$(counterId);
            if (counter$) {
                this.editCounter = {
                    id: counter$().id,
                    name: counter$().name,
                    defaultIncrement: counter$().defaultIncrement,
                    goal: counter$().goal || null,
                    color: counter$().color,
                };
            }
        }
    }

    public saveCounter(counter: EditorViewCounter): void {
        if (counter.id) {
            this.counterService.updateCounter(
                counter.id,
                counter.name,
                counter.defaultIncrement,
                counter.goal !== undefined && counter.goal !== null ? counter.goal : undefined,
                counter.color !== undefined && counter.color !== null ? counter.color : undefined
            );
            this.router.navigate(['detail', counter.id]);
        } else {
            this.counterService.createCounter(
                counter.name,
                counter.defaultIncrement,
                TransactionOperation.ADD,
                counter.initialValue || 0,
                counter.goal !== undefined && counter.goal !== null ? counter.goal : undefined,
                counter.color !== undefined && counter.color !== null ? counter.color : undefined
            );
            this.router.navigate(['/']);
        }
    }

    public closeOverlay(id: string | undefined): void {
        if (id) {
            this.router.navigate(['detail', id]);
        } else {
            this.router.navigate(['/']);
        }
    }
}
