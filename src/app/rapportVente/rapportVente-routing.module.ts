import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { RapportVenteComponent } from './rapportVente.component';
import { RapportFacturationComponent } from './rapportFacturation.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'vente', component: RapportVenteComponent },
            { path: 'facturation', component: RapportFacturationComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RapportVenteRoutingModule { }