import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule} from '@angular/material/table';
import { RapportVenteRoutingModule } from '../rapportVente/rapportVente-routing.module';
import { LayoutComponent } from '../entreprise/layout.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EntrepriseComponent } from './entrepriseComponent';
import { EntrepriseRoutingModule } from './entreprise-routing.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        EntrepriseRoutingModule,
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
        EntrepriseComponent,
    ]
})
export class EntrepriseModule { }