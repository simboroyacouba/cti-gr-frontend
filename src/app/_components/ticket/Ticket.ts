import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CommonModule, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ArticleAVendre } from '@app/_models/ArticleAVendre';
import {NgFor} from '@angular/common';

export interface DialogData {
    nomEntreprise:string;
    adresseEntreprise:string;
    remerciementEntreprise:string;
    photoEntreprise:string;
    articles: ArticleAVendre[];
    tva:number;
    montantTotal:number;
    remise:number;
    montantAPayer:number;
    montantRecu:number;
    montantRendu:number;
    monnaie:string;
    client:string;
    codeFacture:string;
    date:string;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'Ticket.html',
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
  export class Ticket {
    nomEntreprise!:string;
    adresseEntreprise!:string;
    remerciementEntreprise!:string;
    photoEntreprise!:string;
    articles!: ArticleAVendre[];
    tva!:number;
    montantTotal!:number;
    remise!:number;
    montantAPayer!:number;
    montantRecu!:number;
    montantRendu!:number;
    monnaie!:string;
    client!:string;
    codeFacture!:string;
    date!:string;
    constructor(
      public dialogRef: MatDialogRef<Ticket>,
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
      this.articles = this.data.articles;
      this.tva = this.data.tva;
      this.montantTotal = this.data.montantTotal;
      this.remise = this.data.remise;
      this.montantAPayer = this.data.montantAPayer;
      this.montantRecu = this.data.montantRecu;
      this.montantRendu = this.data.montantRendu;
      this.monnaie = this.data.monnaie;
      this.client = this.data.client;
      this.codeFacture = this.data.codeFacture;
      this.date = this.data.date;
      //return resolve;
      });
    }
 
  }