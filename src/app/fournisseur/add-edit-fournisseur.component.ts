﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { AccountService, AlertService } from '@app/_services';
import {User} from '@app/_models/user';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';
import { Role } from '@app/_models/role';
import { Client } from '@app/_models/Client';
import { ClientService } from '@app/_services/clientService';
import { Invoice } from '@app/_models/Invoice';
import { InvoiceService } from '@app/_services/invoice.service';
import { VenteArticle } from '@app/_models/VenteArticle';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { dialogView } from '@app/_components/dialogView/dialogView';

import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Fournisseur } from '@app/_models/Fournisseur';
import { FournisseurService } from '@app/_services/fournisseurService';

@Component({ templateUrl: 'add-edit-fournisseur.component.html' ,
              styleUrls: ['list-fournisseur.component.scss'],})
export class AddEditFournisseurComponent implements OnInit {
    
    //variables poue afficher la liste des facturations du client
    venteArticles!: VenteArticle[];//contient la liste des articles vendus 
    venteArticleGroupe!: VenteArticle[];//contient la liste des articles vendus groupés pour avoir sommes totales
    invoices!: Invoice[];
    articles!: Article[];
    montantTotalPaye: number = 0;
    montantTotalremise: number = 0;
    
    form!: FormGroup;
    id?: BigInt;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    fournisseurAddOrEdit = new Fournisseur;
    userConnected!: User | null;
    listInvoiceOfCustomer!: Invoice[];
    dropdownSettings:IDropdownSettings={};
    isDeleting = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private fournisseurService: FournisseurService,
        private alertService: AlertService,
        
        private invoiceService: InvoiceService,
        private articleService: ArticleService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.userConnected = this.accountService.userValue;  
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });

        if(this.id != undefined){
            this.invoiceService.getByClient(this.id!, new Date(2023, 3, 4), new Date)
            .subscribe((x) => {
                this.listInvoiceOfCustomer = x;
                for(let i = 0; i < this.listInvoiceOfCustomer.length; i++ ){
                    this.montantTotalPaye = this.montantTotalPaye + this.listInvoiceOfCustomer[i].montantAPayer!;
                    this.montantTotalremise = this.montantTotalremise + this.listInvoiceOfCustomer[i].remise!;
                }
                console.log(x);
            });
        }
       
        this.articleService.getAll().subscribe({
            next: (value: Article[]) => this.articles = value,
            error: (error: any) => { }
          });
       
        // form with validation rules
        this.form = this.formBuilder.group({
            code: ['',],
            nom: ['', Validators.required],
            telephone: [, ],
            email: [, ],
            adresse: [,],
            description: [, ],
            actif: [,],

        });
        this.onChanges();

       
        this.title = 'Ajouter un fournisseur';
        if (this.id) {
          // edit mode

          this.title = "Modifier le fournisseur";
          this.loading = true;
          this.fournisseurService.getById(this.id)
              .subscribe((x) => {
                  this.form.patchValue(x);
                  this.fournisseurAddOrEdit.actif = x.actif;
                 this.loading = false;
                });
                
        }  
    }
   
      
      public itemsToString(value:Array<any> = []):string {
        return value
          .map((item:any) => {
            return item.text;
          }).join(',');
      }

    onChanges(): void {
        this.form.valueChanges.subscribe(val => {
            this.fournisseurAddOrEdit = new Fournisseur(this.id,//id
                                     this.form.get('code')?.value,//code
                                      this.form.get('nom')?.value,//nom 
                                      this.form.get('telephone')?.value,//telephone
                                      this.form.get('description')?.value,//date anniversaire
                                      this.form.get('email')?.value,//email   
                                      this.form.get('adresse')?.value,//adresse 
                                      undefined,// date enregistrement
                                         this.form.get('actif')?.value,//actif
                                         );

          });
          
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.savePos(); 
        this.submitting = false;
    }

    private updateFournisseur(){
        this.fournisseurService.update(this.fournisseurAddOrEdit)
        .subscribe({
            next: (x) => {
            this.alertService.success('fournisseur enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/fournisseur');
        },
        error: error => {
            this.alertService.error(error);
        }
    });
    }
    
    private createFournisseur(){
        this.fournisseurAddOrEdit.actif = true;
        this.fournisseurService.insert(this.fournisseurAddOrEdit)
        .subscribe({
            next :(x) => {
            this.alertService.success('fournisseur enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/fournisseur');
        }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }

    private savePos() {
        // create or update user based on id param
        return this.id
            ? this.updateFournisseur()
            : this.createFournisseur();
            
    }

    getNomArticleById (id: BigInt) :string  {
        let nom = '';
        if(this.articles != undefined){
          for(let i = 0; i<this.articles.length; i++){
            if(this.articles[i].id == id ){
              nom =  this.articles[i].nom!;
            }
          }
        }
        return nom;
      }

    invoiceInfo(id: BigInt){
        let poduitsOfInvoice: any[] = [];
        this.invoiceService.getSaleBetweenDate(new Date(2023, 5, 12), new Date()).subscribe({
          next: (produits) => {
            for(let e = 0; e < produits.length; e++){
              if(produits[e].idFacture == id ){
                produits[e].nom = this.getNomArticleById(produits[e].idArticle);
                poduitsOfInvoice.push(produits[e]);
              }
            }console.log(poduitsOfInvoice);
            this.dialog.open(dialogView, {
              data: {
                titre: "Liste des articles de la facturation",
                elements: poduitsOfInvoice,
              },
            });
          },
          error: (error: any) => { }
        });
        
      }

}
