import { Routes } from '@angular/router';

import { HomeComponent } from './layout/pages/home/home.component';
import { CreateComponent } from './layout/pages/create/create/create.component';

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
        path: '**',
        redirectTo: ''
    }
];
