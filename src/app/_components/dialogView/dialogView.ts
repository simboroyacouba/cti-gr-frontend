import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {NgFor} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';


export interface DialogData {
  titre: string;
  elements: any[];
}

@Component({
    selector: 'dialogApprov',
    templateUrl: 'dialogView.html',
    standalone: true,
    imports: [
      MatDialogModule,
       MatButtonModule,
       NgIf,
       NgFor
      ],
  })
  export class dialogView {
      titre = this.data.titre;
      elements = this.data.elements;
      constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
      
    }