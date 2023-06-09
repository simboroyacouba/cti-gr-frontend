import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { VenteArticle } from '@app/_models/VenteArticle';
import { InvoiceService } from '@app/_services/invoice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {formatDate} from '@angular/common';
import { User } from '@app/_models';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';
import { AccountService } from '@app/_services';
import { Invoice } from '@app/_models/Invoice';

@Component({ 
    templateUrl: 'rapportFacturation.component.html',
    styleUrls: ['rapportVente.component.scss'],
})

export class RapportFacturationComponent implements OnInit {
    venteArticles!: VenteArticle[];//contient la liste des articles vendus 
    venteArticleGroupe!: VenteArticle[];//contient la liste des articles vendus groupés pour avour les quantitées
    formFacturation!: FormGroup;
    entreprise!:Entreprise;
    loading = false;
    submitted = false;
    submitting = false;

    invoices!: Invoice[];
    caissierList!: User[];
    posList!: Pos[];
    idCaissierSelected?: BigInt;
    idPosSelected?: BigInt;
    idClientSelected?: BigInt;
    dateInf!: Date;
    dateSup!: Date;
    constructor(
        private invoiceService: InvoiceService,
        private posService: PosService, 
        private accountService: AccountService,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
      this.caissierList = [];
      this.posList = [];
      //this.dateInf = new Date;
      const currentDate = new Date();
      this.dateInf = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      this.dateSup = new Date;

      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      
      this.getDataForm();
     
      this.formFacturation = this.formBuilder.group({
        idCaissier: [, ],  
        idClient: [, ],
        idPos: [, ],
          dateInferieure: [, Validators.required],
          dateSuperieure: [, Validators.required],

      });
      this.onChanges();
    }

    getCaissierList(idPos?: BigInt){
      this.accountService.getAll().subscribe({
        next: (listUser: User[]) => {
          if(idPos != undefined){
            for(let i = 0; i < listUser.length; i++){
             if(listUser[i].idBox == idPos)
                this.caissierList.push(listUser[i]);
            } 
          }else{
            for(let i = 0; i < listUser.length; i++){
              if(listUser[i].idBox != undefined)
                 this.caissierList.push(listUser[i]);
             } 
          }
        },
        error: (error: any) => { }
      });
    }
    getDataForm(){
       this.posService.getAll().subscribe({
        next: (listPos: Pos[]) => {
          this.posList = listPos;
        },
        error: (error: any) => { }
      });

      this.getCaissierList(this.idPosSelected);
    }

    
    getData(){
      //get pos list
     

      if(this.idCaissierSelected == undefined){
        if(this.idClientSelected == undefined){
          this.invoiceService.getbetweenDate(this.dateInf, this.dateSup).subscribe({
            next: (listInvoices: Invoice[]) => {
              console.log('****');
              this.invoices = listInvoices;
            },
            error: (error: any) => { }
          });
        }
        else{
          this.invoiceService.getByClient(this.idClientSelected, this.dateInf, this.dateSup).subscribe({
            next: (listInvoices: Invoice[]) => {
              this.invoices = listInvoices;
            },
            error: (error: any) => { }
          });
        }
      }
      else{
        this.invoiceService.getByEmploye(this.idCaissierSelected, this.dateInf, this.dateSup).subscribe({
          next: (listInvoices: Invoice[]) => {
            this.invoices = listInvoices;
          },
          error: (error: any) => { }
        });
      }
      
      console.log(this.invoices);
    }

    onChanges(): void {
      this.formFacturation.valueChanges.subscribe(val => {
        if( this.formFacturation.get('idPos')?.value !=undefined){
          this.idPosSelected = this.formFacturation.get('idPos')?.value;//id
        }
        if( this.formFacturation.get('idClient')?.value !=undefined){
          this.idClientSelected = this.formFacturation.get('idPos')?.value;//id
        }
        if( this.formFacturation.get('idCaissier')?.value !=undefined){
          this.idCaissierSelected = this.formFacturation.get('idCaissier')?.value;//id
        }
        if(this.formFacturation.get('dateInferieure')?.value != undefined){
          this.dateInf = this.formFacturation.get('dateInferieure')?.value;
        }
        if(this.formFacturation.get('dateSuperieure')?.value != undefined){
          this.dateSup = this.formFacturation.get('dateSuperieure')?.value;
        } 
      });
    }
  
    get fFacturation() { return this.formFacturation.controls; }
    onSubmit() {
        this.submitted = true;
        

        this.submitting = true;
        
        this.submitting = false;
    }
     
  
}