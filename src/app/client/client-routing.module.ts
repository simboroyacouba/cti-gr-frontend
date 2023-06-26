import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListClientComponent } from './list-client.component';
import { AddEditClientComponent } from './add-edit-client.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListClientComponent },
            { path: 'add', component: AddEditClientComponent },
            { path: 'edit/:id', component: AddEditClientComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }