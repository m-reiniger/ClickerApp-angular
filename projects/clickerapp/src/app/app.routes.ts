import { Routes } from '@angular/router';

import { CreateComponent } from '@app/layout/pages/create/create.component';
import { DetailWrapperComponent } from '@app/layout/pages/detail/detail-wrapper.component';
import { HistoryWrapperComponent } from '@app/layout/pages/history/history-wrapper.component';
import { HomeWrapperComponent } from '@app/layout/pages/home/home-wrapper.component';
import { AboutComponent } from '@app/layout/pages/about/about.component';
import { DonationsComponent } from '@app/layout/pages/donations/donations.component';

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
        component: CreateComponent,
    },
    {
        path: 'edit/:counterId',
        component: CreateComponent,
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
        path: '**',
        redirectTo: '',
    },
];
