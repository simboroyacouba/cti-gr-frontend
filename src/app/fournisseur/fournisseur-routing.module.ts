import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListFournisseurComponent } from './list-fournisseur.component';
import { AddEditFournisseurComponent } from './add-edit-fournisseur.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListFournisseurComponent },
            { path: 'add', component: AddEditFournisseurComponent },
            { path: 'edit/:id', component: AddEditFournisseurComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }