import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListPosComponent } from './list-pos.component';
import { AddEditPosComponent } from './add-edit-pos.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListPosComponent },
            { path: 'add', component: AddEditPosComponent },
            { path: 'edit/:id', component: AddEditPosComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }