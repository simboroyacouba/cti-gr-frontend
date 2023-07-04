import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CommonModule, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgFor} from '@angular/common';
import { User } from '@app/_models';
import { Session } from '@app/_models/Session';

export interface DialogData {
  nomEntreprise:string;
  adresseEntreprise:string;
  remerciementEntreprise:string;
  photoEntreprise:string;
  tvaTotal:number;
  montantTotal:number;
  remiseTotal:number;
  montantAPayerTotal:number;
  monnaie:string;
  caissier:User;
  session:Session;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'Rapport.html',
    standalone: true,
    imports: [
      MatDialogModule, 
      MatFormFieldModule, 
      MatInputModule, 
      FormsModule, 
      CommonModule,
      MatButtonModule,
      NgIf,
      NgFor],
  })
  export class Rapport {
    nomEntreprise!:string;
    adresseEntreprise!:string;
    remerciementEntreprise!:string;
    photoEntreprise!:string;
    tvaTotal!:number;
    montantTotal!:number;
    remiseTotal!:number;
    montantAPayerTotal!:number;
    monnaie!:string;
    caissier!:User;
    session!:Session;
    constructor(
      public dialogRef: MatDialogRef<Rapport>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
      this.getData();
    }
    
    getData():Promise<any>{
      return new Promise<string>((resolve, reject) => {
       this.nomEntreprise = this.data.nomEntreprise ;
      this.adresseEntreprise = this.data.adresseEntreprise ;
      this.remerciementEntreprise = this.data.remerciementEntreprise ;
      this.photoEntreprise = this.data.photoEntreprise ;
      this.tvaTotal = this.data.tvaTotal;
      this.montantTotal = this.data.montantTotal;
      this.remiseTotal = this.data.remiseTotal;
      this.montantAPayerTotal = this.data.montantAPayerTotal;
      this.monnaie = this.data.monnaie;
      this.caissier = this.data.caissier;
      this. session= this.data.session;
      //return resolve;
      });
    }
 
  }