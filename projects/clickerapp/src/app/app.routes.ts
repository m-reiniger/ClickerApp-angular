import { Routes } from '@angular/router';

import { CreateComponent } from '@app/layout/pages/create/create.component';
import { DetailComponent } from '@app/layout/pages/detail/detail.component';
import { HistoryComponent } from '@app/layout/pages/history/history.component';
import { HomeComponent } from '@app/layout/pages/home/home.component';
import { AboutComponent } from '@app/layout/pages/about/about.component';

export const routes: Routes = [
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: '',
        component: HomeComponent,
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
        component: DetailComponent,
    },
    {
        path: 'history/:counterId',
        component: HistoryComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
