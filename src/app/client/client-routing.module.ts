import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListClientComponent } from './list-client.component';
import { AddEditClientComponent } from './add-edit-client.component';
import { ListAnniversaireClientComponent } from './list-anniversaireclient.component';
import { InvoicesClientComponent } from './invoices-client.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListClientComponent },
            { path: 'add', component: AddEditClientComponent },
            { path: 'edit/:id', component: AddEditClientComponent },
            { path: 'listbirthday', component: ListAnniversaireClientComponent},
            { path: 'listbirthday/invoicesclient/:id', component: InvoicesClientComponent},   
            { path: 'invoicesclient/:id', component: InvoicesClientComponent}    
        ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }