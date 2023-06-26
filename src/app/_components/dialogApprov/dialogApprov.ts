import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {NgFor} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { VenteArticle } from '@app/_models/VenteArticle';
import { Approvisionnement } from '@app/_models/approvisionnement';


export interface DialogData {
  titre: string;
  element: any;
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialogApprov.html',
    standalone: true,
    imports: [
      MatDialogModule,
       MatButtonModule,
       NgIf,
       NgFor
      ],
  })
  export class dialogApprov {
      titre = this.data.titre;
      element = this.data.element;
      constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
      
    }