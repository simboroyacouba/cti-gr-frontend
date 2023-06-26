import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';


import { AppComponent } from './app.component';

const fournisseurModule = () => import('./fournisseur/fournisseur.module').then(x => x.FournisseurModule);
const clientModule = () => import('./client/client.module').then(x => x.ClientModule);
const rapportVenteModule = () => import('./rapportVente/rapportVente.module').then(x => x.RapportVenteModule);
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const articlesModule = () => import('./articles/articles.module').then(x => x.ArticlesModule);
const posModule = () => import('./pos/pos.module').then(x => x.PosModule);
const venteModule = () => import('./vente/vente.module').then(x => x.VenteModule);


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'fournisseur',  loadChildren: fournisseurModule, canActivate: [AuthGuard] },
    { path: 'client',  loadChildren: clientModule, canActivate: [AuthGuard] },
    { path: 'rapport',  loadChildren: rapportVenteModule, canActivate: [AuthGuard] },
    { path: 'vente',  loadChildren: venteModule, canActivate: [AuthGuard] },
    { path: 'articles',  loadChildren: articlesModule, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'pos', loadChildren: posModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }