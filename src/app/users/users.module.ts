import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule} from '@angular/material/table';
import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ProfilComponent } from './profil.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        MatTableModule,
        MatToolbarModule, 
        MatButtonModule, 
        MatIconModule, FormsModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        ProfilComponent
    ]
})
export class UsersModule { }