import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule} from '@angular/material/table';
import { ArticlesRoutingModule } from './pos-routing.module';
import { LayoutComponent } from './layout.component';
import { ListPosComponent } from './list-pos.component';
import { AddEditPosComponent } from './add-edit-pos.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; 

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
        MatSlideToggleModule
    ],
    declarations: [
        LayoutComponent,
        ListPosComponent,
        AddEditPosComponent,
    ]
})
export class PosModule { }