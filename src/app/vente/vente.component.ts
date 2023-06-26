import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountService, AlertService } from '@app/_services';
import {User} from '@app/_models/user';
import { Article } from '@app/_models/Article';
import { ArticleService } from '@app/_services/article.service';
import { environment } from '@environments/environment';
import { ArticleAVendre } from '@app/_models/ArticleAVendre';
import { Invoice } from '@app/_models/Invoice';
import { InvoiceService } from '@app/_services/invoice.service';
import { SessionService } from '@app/_services/session.service';
import { Session } from '@app/_models/Session';
import { Entreprise } from '@app/_models/Entreprise';
import { VenteArticle } from '@app/_models/VenteArticle';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '@app/_models/Client';
import { ClientService } from '@app/_services/clientService';

import { AlertDialog } from '@app/_components/alertDialog/AlertDialog';
import { DialogInfo } from '@app/_components/dialogInfo/DialogInfo';

@Component({ templateUrl: 'vente.component.html' ,
              styleUrls: ['list-vente.component.scss'],
            })


export class VenteComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    clients!: Client[];//liste des clients
    userConnected!: User | null;//contient les infos de l'utilisateur connecté
    articles!: Article[];//contien la liste des articles
    ouvrirSession = false;//varriable pour afficher soit le pos ou ouvrir session active
    articleAVendre!: ArticleAVendre[];
    invoiceActual?:Invoice;
    entreprise!:Entreprise;
    //variables creer facture
    idEmploye!: BigInt;
    idClient!: BigInt;
    actualSession?: Session;

    //variables edit facture
    id!:BigInt;//id de la facture
    montantTotal!:number;
    remiseBoolean = false;
    remise!:number;
    montantAPayer!:number;
   
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private articleService: ArticleService,
        private invoiceService: InvoiceService,
        private alertService: AlertService,
        private sessionService: SessionService,
        public dialog: MatDialog,
        private clientService: ClientService
        
    ) {}

    ngOnInit() {
        this.montantTotal = 0;
        this.montantAPayer = 0;
        this.articleAVendre = [];
        this.userConnected = this.accountService.userValue;

        //récuperer l'utilisateur connecté
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
            this.getActiveSession();
        });

        //recupérer la liste des clients
        this.clientService.getAll().subscribe({
            next: (value: Client[]) => this.clients = value,
            error: (error: any) => { }
          });

        //recuperer leq aticles a afficher dans le POS
        this.getArticles();

        this.accountService.getEntreprise()
        .subscribe((x) => {
            this.entreprise = x;
        });

       
       
        // form with validation rules
        this.form = this.formBuilder.group({
                    idClient: [,],
                    remiseBoolean: [,],
                    remise: [,],
        });

        this.onChanges();// actaliser les valeurs a chaque modification du formulaire
        this.calculerMotant(); // actaliser les valeurs a chaque modification du formulaire
    }
   
    getActualInvoice(){
        //s'il y a une facturation en cours la récuperer
        this.invoiceService.getActiveInvoice(this.actualSession!.id!)
        .subscribe({
            next :(x) => {
                if(x != undefined){
                    this.invoiceActual = x;
                }
        }, 
        error: error => {
            this.alertService.error(error);
        }
        });
    }
    getArticles(){
        this.articleService.getAll()
        .subscribe((x) => {
            
            for(let i=0; i<x.length ; i++){
                x[i].photo = `${environment.apiUrl}/api/auth/download?chemin=`+x[i].photo?.replace(/\\/g, '/');
            }
            this.articles = x;
        });
    }
    getActiveSession(){
        //S'il y a une session active la récupérer
        this.sessionService.getAvtiveSession(this.userConnected!.idBox!)
        .subscribe({
            next :(x) => {
                if(x != undefined){
                    this.actualSession = x;
                    this.getActualInvoice();
                }
        }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }
      
      public itemsToString(value:Array<any> = []):string {
        return value
          .map((item:any) => {
            return item.text;
          }).join(',');
      }
      
      ajouterArticle(idArticle:BigInt, nomArticle:string, prixUnitaire:number): void {
       
        if(this.invoiceActual != undefined){
                let articleOnCart = false;
            if(this.articleAVendre.length == 0){
                    this.articleAVendre.push({idArticle:idArticle, nomArticle:nomArticle, idSession:this.actualSession!.id, idFacture:this.invoiceActual.id, quantite:1, prixUnitaire:prixUnitaire, montant:prixUnitaire} );
            }
            else{
                for(let i = 0; i < this.articleAVendre.length; i++){
                
                    if(this.articleAVendre[i].idArticle == idArticle){
                        articleOnCart = true;
                        break;
                    }
                }
                if(articleOnCart == false){
                    this.articleAVendre.push({idArticle:idArticle, nomArticle:nomArticle, idSession:this.actualSession!.id, idFacture:this.invoiceActual.id, quantite:1, prixUnitaire:prixUnitaire, montant:prixUnitaire} );
                }
                else{
                    let itemToUpdate = this.articleAVendre.find(item => item.idArticle == idArticle);
                    if (itemToUpdate) {
                        itemToUpdate.quantite = itemToUpdate.quantite!+1;
                        itemToUpdate.montant = itemToUpdate.quantite*itemToUpdate.prixUnitaire!;
                    }
                }
            } 
            this.calculerMotant();
        }
            
    }

    retrancherQteArticle(id: BigInt){
        let itemToUpdate = this.articleAVendre.find(item => item.idArticle == id);
        if (itemToUpdate!.quantite!>0) {
            itemToUpdate!.quantite = itemToUpdate!.quantite!-1;
            itemToUpdate!.montant = itemToUpdate!.quantite*itemToUpdate!.prixUnitaire!;
        }
        if(itemToUpdate!.quantite == 0) {
            const index = this.articleAVendre.findIndex(item => item.idArticle == id);
            if (index !== -1) {
              this.articleAVendre.splice(index, 1);
            }  
        }
        this.calculerMotant();
    }
    supprimerArticle(id: BigInt){
        const index = this.articleAVendre.findIndex(item => item.idArticle == id);
        if (index !== -1) {
            this.articleAVendre.splice(index, 1);
        }  
        
        this.calculerMotant();
    }

    
    calculerMotant(){
        this.montantTotal = 0;
        this.montantAPayer = 0;
        for(let i = 0; i < this.articleAVendre.length; i++){
            this.montantTotal = this.montantTotal + this.articleAVendre[i].montant!;
        }
        if(this.remiseBoolean == true){
            if(this.remise>0){
                if(this.remise < this.montantTotal){
                    this.montantAPayer = this.montantTotal-this.remise;
                }
            }
            else{
                this.montantAPayer = this.montantTotal;
            }
        }
        else{
           this.montantAPayer = this.montantTotal;
        }
    }
    augmenterQteArticle(id:BigInt){
        let itemToUpdate = this.articleAVendre.find(item => item.idArticle == id);
            if (itemToUpdate) {
                itemToUpdate.quantite = itemToUpdate.quantite!+1;
                itemToUpdate.montant = itemToUpdate.quantite*itemToUpdate.prixUnitaire!;
            }
            this.calculerMotant();
    }
    viderPanier(){
        this.articleAVendre = [];
        this.montantTotal = 0;
        this.montantAPayer = 0;
    }

   
    creerFacture(): void {
        
        this.invoiceActual = new Invoice(undefined,//id
            undefined,//code
            this.userConnected!.id,//id caissier
            this.idClient,//id client
            this.actualSession!.id,//id de session
            undefined,//montant total
            undefined,//remise
            undefined,//montant à payer
            undefined,//clos
            undefined);//date

            
        //creer la facture
        console.log(this.invoiceActual);
        this.invoiceService.insert(this.invoiceActual!)
        .subscribe({
            next :(x) => {
                this.invoiceService.getActiveInvoice(this.actualSession!.id!)
                .subscribe({
                    next :(y) => {
                        if(y != undefined){
                            this.invoiceActual = y;
                        }
                }, 
                    error: error => {
                        this.alertService.error(error);
                    }
                });
            }, 
            error: (error) => {
                this.alertService.error(error.message);
            }
        });
      }
     
/*
      validerFacture(): void {
        this.loading = true;
        this.getArticles;
        let validerLaVente :boolean = true;
        for(let i=0; i<this.articleAVendre.length ; i++){
            for(let a=0; a<this.articles.length ; a++){
                if(this.articleAVendre[i].idArticle == this.articles[a].id){
                    if(this.articles[a].stock! < this.articleAVendre[i].quantite!){
                        validerLaVente = false;
                        break;
                    }
                }
            }
            
        }
        
        
        if(validerLaVente == true){
            
            this.invoiceActual!.montantTotal = this.montantTotal;
            this.invoiceActual!.remise = this.remise;
            this.invoiceActual!.montantAPayer = this.montantAPayer!;
            this.invoiceActual!.idClient = this.idClient;
            //ajouter les montants a la facture
            if(this.montantTotal>0 && this.montantAPayer>0){
                this.invoiceService.addamount(this.invoiceActual!)
                .subscribe({//ajouter les montant a la facture
                    next :(x) => {
                        this.invoiceService.close(this.invoiceActual!.id!)
                        .subscribe({// fermer la facture
                            next :(y) => {
                                for(const artAVendre of this.articleAVendre){//boucle pour enregister tous les produits dans la table vente
                                    try {
                                        this.invoiceService.insertArticle(new VenteArticle(undefined,//id
                                                                                    undefined,//date
                                                                                    artAVendre.idArticle,//idArticle
                                                                                    artAVendre.idSession,//idsession
                                                                                    artAVendre.idFacture,//idfacture
                                                                                    artAVendre.quantite,//quantite
                                                                                    artAVendre.prixUnitaire//prixUnitaire
                                                                                    ))
                                        .subscribe({
                                            next :(z) => { }, 
                                            error: error => {
                                                this.alertService.error(error);
                                            }
                                        });
                                    } catch (error) {
                                    }
                                
                                }
                                this.invoiceActual = undefined;
                                this.ngOnInit();
                            }, 
                            error: error => {
                                this.alertService.error(error);
                            }
                        });
                    }, 
                    error: error => {
                        this.alertService.error(error);
                    }
                });
            }
        }
        else{
            const dialogRef = this.dialog.open(DialogInfo, {
                data: {name: "Un poduit dans la liste que vous eaayez de vendre a sin stock épuisé"},
              });
        }
        this.loading = false;
        
    }

   */ 
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onChanges(): void {
        this.form.valueChanges.subscribe(val => {
            this.idClient = this.form.get('idClient')?.value;
            this.remise = this.form.get('remise')?.value;
            this.remiseBoolean = this.form.get('remiseBoolean')?.value;
            this.calculerMotant();

          });
    }

    openActiveSession(){
        this.ouvrirSession = true;
    }

    createSession(){
        if(this.userConnected?.idBox != undefined){
             this.actualSession = new Session(undefined,//id
                                            undefined,
                                            this.userConnected?.idBox ,//idCaisse
                                            this.userConnected?.id,//idUser
                                            true,//etat (actif)
                                            undefined,//date fermeture
                                            undefined//date ouverture
                                        );

        
        this.actualSession.id = undefined;

        this.sessionService.insert(this.actualSession)
        .subscribe({
            next :(x) => {
                //this.actualSession!.id = BigInt(x.message!);
                this.sessionService.getAvtiveSession(this.userConnected!.idBox!)
                .subscribe({
                    next :(x) => {
                    if(x != undefined){
                        this.actualSession = x;
                    }
                }, 
                    error: error => {
                    this.alertService.error(error);
                }
        });
        }, 
            error: error => {
                this.alertService.error(error);
            }
        });
        }
       this. ouvrirSession = true;
    }
    
    closeSession(){
        const dialogRef = this.dialog.open(AlertDialog, {
            data: {name: "Voulez vous fermer la session ?"},
            });
          dialogRef.afterClosed().subscribe(result => {
            if(result === true){
                this.sessionService.closeSession(this.actualSession!.id! as BigInt)
                .subscribe({
                    next :(x) => {
                        this.actualSession = undefined;
                }, 
                    error: error => {
                        this.alertService.error(error);
                    }
                });
            }else{console.log('ne pasfermer');}
          
        });
    }
    
    validerVente(): void/*boolean | undefined*/ {

        this.loading = true;
        this.getArticles;
        let validerLaVente :boolean = true;
        for(let i=0; i<this.articleAVendre.length ; i++){
            for(let a=0; a<this.articles.length ; a++){
                if(this.articleAVendre[i].idArticle == this.articles[a].id){
                    if(this.articles[a].achat == true){
                        if(this.articles[a].stock! < this.articleAVendre[i].quantite!){
                        validerLaVente = false;
                        break;
                        }
                    }
                    
                }
            }
            
        }
        
        
        if(validerLaVente == true){
            if(this.articleAVendre.length > 0){
            const dialogRef = this.dialog.open(AlertDialog, {
            data: {name: "Voulez vous valider la vente?"},
            });
            let resultat = false;
            this.loading = true;
            dialogRef.afterClosed().subscribe(result => {
            resultat = result;
            if(resultat === true){
                this.invoiceActual!.montantTotal = this.montantTotal;
                this.invoiceActual!.remise = this.remise;
                this.invoiceActual!.montantAPayer = this.montantAPayer!;
                this.invoiceActual!.idClient = this.idClient;
                //ajouter les montants a la facture
                if(this.montantTotal>0 && this.montantAPayer>0){
                    this.invoiceService.addamount(this.invoiceActual!)
                    .subscribe({//ajouter les montant a la facture
                        next :(x) => {
                            this.invoiceService.close(this.invoiceActual!.id!)
                            .subscribe({// fermer la facture
                                next :(y) => {
                                    for(const artAVendre of this.articleAVendre){//boucle pour enregister tous les produits dans la table vente
                                        try {
                                            this.invoiceService.insertArticle(new VenteArticle(undefined,//id
                                                                                        undefined,//date
                                                                                        artAVendre.idArticle,//idArticle
                                                                                        artAVendre.idSession,//idsession
                                                                                        artAVendre.idFacture,//idfacture
                                                                                        artAVendre.quantite,//quantite
                                                                                        artAVendre.prixUnitaire//prixUnitaire
                                                                                        ))
                                            .subscribe({
                                                next :(z) => { }, 
                                                error: error => {
                                                    this.alertService.error(error);
                                                }
                                            });
                                        } catch (error) {
                                        }
                                    
                                    }
                                    this.invoiceActual = undefined;
                                    this.ngOnInit();
                                }, 
                                error: error => {
                                    this.alertService.error(error);
                                }
                            });
                        }, 
                        error: error => {
                            this.alertService.error(error);
                        }
                    });
                }
                }else{console.log('ne pas vendre');}
            
            });
        }
        
        
        }else{
            const dialogRef = this.dialog.open(DialogInfo, {
                data: {name: "Un poduit dans la liste que vous eaayez de vendre a son stock épuisé"},
            });
        }
        this.loading = false;
    }

    fermerFacture(){
        this.loading = true;
        this.invoiceService.close(this.invoiceActual!.id!)
        .subscribe({// fermer la facture
            next :(y) => {
                this.invoiceActual = undefined;
            }, 
            error: error => {
                this.alertService.error(error);
            }
        });
        this.loading = false;
    }
}
