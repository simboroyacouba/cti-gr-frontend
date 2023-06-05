import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListArticleComponent } from './list-article.component';
import { AddEditArticleComponent } from './add-edit-article.component';
import { AddEditArticleTypeComponent } from './add-edit-articleType.component';
import { ListArticleTypeComponent } from './list-articleType.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListArticleComponent },
            { path: 'add', component: AddEditArticleComponent },
            { path: 'edit/:id', component: AddEditArticleComponent },
            { path: 'articleType', component: ListArticleTypeComponent },
            { path: 'articleType/add', component: AddEditArticleTypeComponent },
            { path: 'articleType/edit/:id', component: AddEditArticleTypeComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }