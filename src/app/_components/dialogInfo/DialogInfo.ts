import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface DialogData {
    name: string;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'DialogInfo.html',
    standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  })
  export class DialogInfo {
    texte!:string;
    constructor(
      public dialogRef: MatDialogRef<DialogInfo>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
       this.texte = data.name; 
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
  }