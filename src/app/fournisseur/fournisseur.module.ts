import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule} from '@angular/material/table';
import { ArticlesRoutingModule } from './fournisseur-routing.module';
import { LayoutComponent } from './layout.component';
import { ListFournisseurComponent } from './list-fournisseur.component';
import { AddEditFournisseurComponent } from './add-edit-fournisseur.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; 
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

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
        MatDialogModule
    ],
    declarations: [
        LayoutComponent,
        ListFournisseurComponent,
        AddEditFournisseurComponent,
    ]
})
export class FournisseurModule { }