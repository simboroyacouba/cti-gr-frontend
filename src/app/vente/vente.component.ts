import { Component, OnInit, Inject, SecurityContext } from '@angular/core';
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
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Ticket } from '@app/_components/ticket/Ticket';
import { DatePipe } from '@angular/common';
import { Rapport } from '@app/_components/rapport/Rapport';

@Component({ templateUrl: 'vente.component.html' ,
              styleUrls: ['list-vente.component.scss'],
            })


export class VenteComponent implements OnInit {
    searchForm!: FormGroup;
    textRecherche!: string;
    formCodeBar!: FormGroup;
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    clients!: Client[];//liste des clients
    userConnected!: User | null;//contient les infos de l'utilisateur connecté
    articles!: Article[];//contien la liste des articles
    articlesGlobal!: Article[]; //contien la liste des articles en memoire pour réinitialiser la recherche
    ouvrirSession = false;//varriable pour afficher soit le pos ou ouvrir session active
    articleAVendre!: ArticleAVendre[];
    invoiceActual?:Invoice;
    entreprise!:Entreprise;
    //variables creer facture
    idEmploye!: BigInt;
    idClient!: BigInt|undefined;
    actualSession?: Session;
    sessionsClosed: Session[] = [];
    //variables edit facture
    id!:BigInt;//id de la facture
    montantTotal!:number;
    remiseBoolean = false;
    tva!: number;
    remise!:number;
    montantRecu!:number;
    montantAPayer!:number;
   
  dropdownSettings:IDropdownSettings = {};
  
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
        private clientService: ClientService,
        protected sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.montantTotal = 0;
        this.montantAPayer = 0;
        this.tva = 0;
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
            next: (value: Client[]) => {
                this.clients = value
                for(let i = 0; i < this.clients.length; i++){
                    this.clients[i].nom = this.clients[i].nom+' '+this.clients[i].prenom+' ('+this.clients[i].code+')'
                }
            },
            error: (error: any) => { }
          });

        //recuperer leq aticles a afficher dans le POS
        this.getArticles();

        this.accountService.getEntreprise()
        .subscribe((x) => {
            this.entreprise = x;
        });

        this.dropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'nom',
            itemsShowLimit: 3,
            allowSearchFilter: true
           
          };
        // form with validation rules
        this.form = this.formBuilder.group({
                    idClient: [,],
                    remiseBoolean: [,],
                    remise: [,],
                    montantRecu: [,]
        });

        this.formCodeBar = this.formBuilder.group({
            codeBar: [,]
        });
        this.searchForm = this.formBuilder.group({
            textRecherche: ['',],
        })

        this.recherche();
        this.onChanges();// actaliser les valeurs a chaque modification du formulaire
        this.calculerMotant(); // actaliser les valeurs a chaque modification du formulaire
        this.getSessionsClosed(); //recupperer les sessions fermées
    }
    getSessionsClosed(){
        this.sessionService.getAll()
        .subscribe((x) => {
            for(let session of x){
                if(session.idEmploye == this.userConnected!.id){
                    this.sessionsClosed.push(session);
                }
            }
            //garder uniquement les 10 dernières sessions das le tableau
            this.sessionsClosed = this.sessionsClosed.slice(-10);
            //trier le tableau par ordre de date
            this.sessionsClosed.sort((a, b) => new Date(b.datefermeture!).getTime() - new Date(a.datefermeture!).getTime());
          
        })
    }
    recherche(): void {
        setTimeout(() => {
            this.searchForm.valueChanges.subscribe(val => {
            this.textRecherche = this.searchForm.get('textRecherche')?.value;
            if(this.textRecherche != undefined || this.textRecherche !=''){
                this.articles = [];
                for(let i = 0; i < this.articlesGlobal.length; i++){
                    if(this.articlesGlobal[i].nom!.indexOf(this.textRecherche)!== -1  || this.articlesGlobal[i].code!.indexOf(this.textRecherche)!== -1){
                        this.articles.push(this.articlesGlobal[i]);
                    }
                }
            }
            });
        }, 1000);
    }
    onPrint() {
        
       var datePipe = new DatePipe('en-US');
        const dialogRef = this.dialog.open(Ticket, {
            
            data: {
                nomEntreprise: this.entreprise.nom,
                adresseEntreprise: this.entreprise.ville,
                remerciementEntreprise: this.entreprise.texte4,
                photoEntreprise: `${environment.apiUrl}/api/auth/download?chemin=`+this.entreprise?.image?.replace(/\\/g, '/'),
                articles: this.articleAVendre,
                tva: this.tva,
                montantTotal: this.montantTotal,
                remise: this.remise,
                montantAPayer: this.montantAPayer,
                montantRecu: this.montantRecu,
                montantRendu: this.montantRecu-this.montantAPayer,
                monnaie: this.entreprise.monnaie,
                client: this.getNomClientWithId(this.idClient!),
                codeFacture: this.invoiceActual!.code,
                date:datePipe.transform(this.invoiceActual?.date, 'dd/MM/yyyy: H:mm'),
            },
        });
        setTimeout(() => {
            const printContents = document.getElementById("tick")?.innerHTML;
            const popupWindow = window.open('', '_blank', 'width=600,height=600');
            popupWindow!.document.open();
            popupWindow!.document.write(`
              <html>
                <body onload="window.print(); window.close();">${printContents}</body>
              </html>
            `);
            popupWindow!.document.close();
          }, 1000);
    }

    //Imprimer le rapport de session
    onPrintRapport(idSession: BigInt) {
        
        let session:Session;
        let tvaTotalRapport:number = 0;
        let montantTotalRapport:number = 0;
        let remiseTotalRapport:number = 0;
        let montantAPayerTotalRapport:number = 0;
        let invoicesRapport!:Invoice[];
        let caissier!:User;

        this.sessionService.getOne(idSession)//recupperer la session dont on veut imprimer le rapport
        .subscribe((x) => {
            session = x;
    console.log(session.id);
            this.invoiceService.getBySession(session.id!)//recuperer les facturations de la session
            .subscribe((y) => {
                invoicesRapport = y;
                this.accountService.getById(session.idEmploye!)//recuperer le caissier de la session
                .subscribe((z) => {
                    caissier = z;
                
            
                for(let invoice of invoicesRapport){
                    montantAPayerTotalRapport = montantAPayerTotalRapport + invoice.montantAPayer!;
                    tvaTotalRapport = tvaTotalRapport + invoice.tva!;
                    remiseTotalRapport = remiseTotalRapport + invoice.remise!;
                    montantTotalRapport = montantTotalRapport + invoice.montantTotal!;
                }
                var datePipe = new DatePipe('en-US');
                const dialogRef = this.dialog.open(Rapport, {
                
                data: {
                    nomEntreprise: this.entreprise.nom,
                    adresseEntreprise: this.entreprise.ville,
                    remerciementEntreprise: this.entreprise.texte4,
                    photoEntreprise: `${environment.apiUrl}/api/auth/download?chemin=`+this.entreprise?.image?.replace(/\\/g, '/'),
                    tvaTotal: tvaTotalRapport,
                    montantTotal: montantTotalRapport,
                    remiseTotal: remiseTotalRapport,
                    montantAPayerTotal: montantAPayerTotalRapport,
                    monnaie: this.entreprise.monnaie,
                    caissier: caissier,
                    session: session,
                },
            });
            setTimeout(() => {
                const printContents = document.getElementById("tick")?.innerHTML;
                const popupWindow = window.open('', '_blank', 'width=600,height=600');
                popupWindow!.document.open();
                popupWindow!.document.write(`
                <html>
                    <body onload="window.print(); window.close();">${printContents}</body>
                </html>
                `);
                popupWindow!.document.close();
            }, 1000);
                });
            });
        });
     }
    
    validerCodeBar(){
        this.formCodeBar.get('codeBar')?.value;
        if(this.formCodeBar.get('codeBar')?.value != undefined){
            let art = this.getIdArticleFromCodeBar(this.formCodeBar.get('codeBar')?.value);
            
            if(art.id != undefined){
                this.ajouterArticle(art.id!, art.nom!, art.prixVente!, art.tva!)
                this.formCodeBar.reset();
            }
        }
    }
    getIdArticleFromCodeBar(codeBAR: string):Article{
        let infoArticle: Article = new Article;
        for(let i = 0; i < this.articles.length; i++){
            if(this.articles[i].codeBar == codeBAR){
                infoArticle.id = this.articles[i].id;
                infoArticle.nom = this.articles[i].nom;
                infoArticle.prixVente = this.articles[i].prixVente;
                break;
            }
        }
        return infoArticle;
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
            this.articles = [];
                    this.articlesGlobal = [];
            for(let i=0; i<x.length ; i++){
                x[i].photo = `${environment.apiUrl}/api/auth/download?chemin=`+x[i].photo?.replace(/\\/g, '/');
            }
            for(let i=0; i<x.length ; i++){
                if(x[i].actif == true){
                    this.articles.push(x[i]);
                    this.articlesGlobal.push(x[i]);
                }
            }
        });
    }

    getNomClientWithId(idClient: BigInt): string|undefined{
        let nomClient: string|undefined = undefined;
        for(let client of this.clients){
            if(client.id == idClient){
                let a = client.nom!.indexOf('(');
                 nomClient = client.nom!.substring(0, a);
                 break;
            }
        }
       
        return nomClient;
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
      
      ajouterArticle(idArticle:BigInt, nomArticle:string, prixUnitaire:number, tvaArticle:number): void {
       
        if(this.invoiceActual != undefined){
                let articleOnCart = false;
            if(this.articleAVendre.length == 0){
                    this.articleAVendre.push({idArticle:idArticle, nomArticle:nomArticle, idSession:this.actualSession!.id, idFacture:this.invoiceActual.id, quantite:1, prixUnitaire:prixUnitaire, montant:prixUnitaire, tva:tvaArticle} );
            }
            else{
                for(let i = 0; i < this.articleAVendre.length; i++){
                
                    if(this.articleAVendre[i].idArticle == idArticle){
                        articleOnCart = true;
                        break;
                    }
                }
                if(articleOnCart == false){
                    this.articleAVendre.push({idArticle:idArticle, nomArticle:nomArticle, idSession:this.actualSession!.id, idFacture:this.invoiceActual.id, quantite:1, prixUnitaire:prixUnitaire, montant:prixUnitaire, tva:tvaArticle} );
                }
                else{
                    let itemToUpdate = this.articleAVendre.find(item => item.idArticle == idArticle);
                    if (itemToUpdate) {
                        itemToUpdate.quantite = itemToUpdate.quantite!+1;
                        itemToUpdate.montant = itemToUpdate.quantite*itemToUpdate.prixUnitaire!;
                        itemToUpdate.tva = itemToUpdate.quantite*itemToUpdate.tva!;
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
        this.tva = 0;
        for(let i = 0; i < this.articleAVendre.length; i++){
            this.montantTotal = this.montantTotal + this.articleAVendre[i].montant!;
            this.tva = this.tva + this.articleAVendre[i].tva!/100 * this.articleAVendre[i].montant!;
        }
        if(this.remiseBoolean == true){
            if(this.remise>0){
                if(this.remise < this.montantTotal){
                    this.montantAPayer = this.montantTotal-this.remise + this.tva;
                }
            }
            else{
                this.montantAPayer = this.montantTotal + this.tva;
            }
        }
        else{
           this.montantAPayer = this.montantTotal + this.tva;
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
        this.tva = 0;
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
            let a:any[] = this.form.get('idClient')?.value;
            
            if(a != undefined){
                if(a.length > 0){
                    this.idClient = a[0].id ;
                }else{
                    this.idClient = undefined;
                }
            }
           
            this.remise = this.form.get('remise')?.value;
            
            this.montantRecu = this.form.get('montantRecu')?.value;
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
                this.sessionService.closeSession(this.actualSession!.id!)
                .subscribe({
                    next :(x) => {
                        this.actualSession = undefined;
                }, 
                    error: error => {
                        this.alertService.error(error);
                    }
                });
            }else{}
          
        });
    }
    
    validerVente(): void/*boolean | undefined*/ {

        this.loading = true;
        this.getArticles;
        let validerLaVente :boolean = true;
        if(this.montantRecu >this.montantAPayer){
            for(let i=0; i<this.articleAVendre.length ; i++){
                for(let a=0; a<this.articles.length ; a++){
                    if(this.articleAVendre[i].idArticle == this.articles[a].id){
                        if(this.articles[a].achat == true){
                            if(this.articles[a].stock! < this.articleAVendre[i].quantite!){
                                validerLaVente = false;
                                const dialogRef = this.dialog.open(DialogInfo, {
                                    data: {name: "Un poduit dans la liste que vous eaayez de vendre a son stock épuisé"},
                                });
                                break;
                            }
                        }
                        
                    }
                }
            }
        }
        else{
            validerLaVente = false;
            const dialogRef = this.dialog.open(DialogInfo, {
                data: {name: "Le montant recu est inférieur au montant a payer"},
            });
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
                this.invoiceActual!.tva = this.tva;
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
                                                                                        artAVendre.prixUnitaire,//prixUnitaire
                                                                                        undefined,//montant total
                                                                                        artAVendre.tva!*artAVendre.prixUnitaire!/100,//tva
                                                                                        undefined//totalTva
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
                                    this.onPrint();
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
                }else{}
            
            });
        }
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
