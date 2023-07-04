import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule} from '@angular/material/table';
import { VenteRoutingModule } from './vente-routing.module';
import { LayoutComponent } from './layout.component';
import { VenteComponent } from './vente.component';
import { ListVenteComponent } from './list-vente.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; 
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        VenteRoutingModule,
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
        MatGridListModule,
        MatCardModule,
        MatDialogModule,
    ],
    declarations: [
        LayoutComponent,
        ListVenteComponent,
        VenteComponent,
    ]
})
export class VenteModule { }