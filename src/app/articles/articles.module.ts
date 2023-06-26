import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule} from '@angular/material/table';
import { ArticlesRoutingModule } from './articles-routing.module';
import { LayoutComponent } from './layout.component';
import { ListArticleTypeComponent } from './list-articleType.component';
import { AddEditArticleTypeComponent } from './add-edit-articleType.component';
import { ListArticleComponent } from './list-article.component';
import { AddEditArticleComponent } from './add-edit-article.component';

import { RestockageArticleComponent } from './restockage-article.component';
import { DepackageArticleComponent } from './depackage-article.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';
import { ListApprovComponent } from './list-approv.component';
import { ListDepackComponent } from './list-depack.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ArticlesRoutingModule,
        MatTableModule,
        MatToolbarModule, 
        MatButtonModule, 
        MatIconModule,
        MatPaginatorModule,
        NgMultiSelectDropDownModule.forRoot(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatDialogModule,
    ],
    declarations: [
        LayoutComponent,
        ListArticleComponent,
        AddEditArticleComponent,
        AddEditArticleTypeComponent,
        ListArticleTypeComponent,
        RestockageArticleComponent,
        DepackageArticleComponent,
        ListApprovComponent,
        ListDepackComponent
    ]
})
export class ArticlesModule { }