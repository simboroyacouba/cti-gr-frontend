import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListArticleComponent } from './list-article.component';
import { AddEditArticleComponent } from './add-edit-article.component';
import { AddEditArticleTypeComponent } from './add-edit-articleType.component';
import { ListArticleTypeComponent } from './list-articleType.component';

import { DepackageArticleComponent } from './depackage-article.component';

import { RestockageArticleComponent } from './restockage-article.component';
import { ListApprovComponent } from './list-approv.component';
import { ListDepackComponent } from './list-depack.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListArticleComponent },
            { path: 'add', component: AddEditArticleComponent },
            { path: 'edit/:id', component: AddEditArticleComponent },
            { path: 'articleType', component: ListArticleTypeComponent },
            { path: 'articleType/add', component: AddEditArticleTypeComponent },
            { path: 'articleType/edit/:id', component: AddEditArticleTypeComponent },
            { path: 'depackage/:id', component: DepackageArticleComponent },
            { path: 'restockage/:id', component: RestockageArticleComponent },
            { path: 'listapprov', component: ListApprovComponent },
            { path: 'listdepack', component: ListDepackComponent },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }