import { Routes } from '@angular/router';

import { AboutComponent } from '@app/layout/pages/about/about.component';
import { AutomationWrapperComponent } from './layout/pages/automation/automation-wrapper/automation-wrapper.component';
import { DetailWrapperComponent } from '@app/layout/pages/detail/detail-wrapper.component';
import { DonationsComponent } from '@app/layout/pages/donations/donations.component';
import { EditorWrapperComponent } from '@app/layout/pages/editor/editor-wrapper.component';
import { HistoryWrapperComponent } from '@app/layout/pages/history/history-wrapper.component';
import { HomeWrapperComponent } from '@app/layout/pages/home/home-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeWrapperComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'donate',
        component: DonationsComponent,
    },
    {
        path: 'create',
        component: EditorWrapperComponent,
    },
    {
        path: 'edit/:counterId',
        component: EditorWrapperComponent,
    },
    {
        path: 'detail/:counterId',
        component: DetailWrapperComponent,
    },
    {
        path: 'history/:counterId',
        component: HistoryWrapperComponent,
    },
    {
        path: 'automation/:counterId',
        component: AutomationWrapperComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
