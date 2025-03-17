import { Routes } from '@angular/router';

import { CreateComponent } from '@app/layout/pages/create/create.component';
import { DetailComponent } from '@app/layout/pages/detail/detail.component';
import { HomeComponent } from '@app/layout/pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'edit/:counterId',
        component: CreateComponent
    },
    {
        path: 'detail/:counterId',
        component: DetailComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
