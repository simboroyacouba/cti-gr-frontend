import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { VenteArticle } from '@app/_models/VenteArticle';
import { InvoiceService } from '@app/_services/invoice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DatePipe, formatDate} from '@angular/common';
import { User } from '@app/_models';
import { Pos } from '@app/_models/pos';

import { dialogView } from '@app/_components/dialogView/dialogView';
import { PosService } from '@app/_services/pos.service';
import { AccountService } from '@app/_services';
import { Invoice } from '@app/_models/Invoice';
import { Client } from '@app/_models/Client';
import { ClientService } from '@app/_services/clientService';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SessionService } from '@app/_services/session.service';

import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { ArticleType } from '@app/_models/ArticleType';
import { environment } from '@environments/environment';

@Component({ 
    templateUrl: 'rapportFacturation.component.html',
    styleUrls: ['rapportVente.component.scss'],
})

export class RapportFacturationComponent implements OnInit {
    venteArticles!: VenteArticle[];//contient la liste des articles vendus 
    venteArticleGroupe!: VenteArticle[];//contient la liste des articles vendus groupés pour avoir sommes totales
    formFacturation!: FormGroup;
    entreprise!:Entreprise;
    loading = false;
    submitted = false;
    submitting = false;
    articles!: Article[];
    
    invoices!: Invoice[];
    caissierList!: User[];
    posList!: Pos[];
    clientList!: Client[];
    idSessionSelected?:BigInt;
    codeSessionSelected?:BigInt;
    idCaissierSelected?: BigInt;
    idPosSelected?: BigInt;
    idClientSelected?: BigInt;
    dateInf!: Date;
    dateSup!: Date;

    rechercherPar = 'caisse';
    totalMontant: number = 0;
    totalRemise: number = 0;
    totalTva: number = 0;
    totalMontantAPayer: number = 0;
    constructor(
        private invoiceService: InvoiceService,
        private sessionService: SessionService,
        private clientService: ClientService,
        private posService: PosService, 
        private articleService: ArticleService,
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
      this.caissierList = [];
      this.posList = [];
      //this.dateInf = new Date;
      const currentDate = new Date();
      this.dateInf = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      this.dateSup = new Date;
      this.accountService.getEntreprise()
      .subscribe((x) => {
          this.entreprise = x;
      });
      this.articleService.getAll().subscribe({
        next: (value: Article[]) => this.articles = value,
        error: (error: any) => { }
      });

      this.getDataForm();
     this.getData();
      this.formFacturation = this.formBuilder.group({
        rechercherPar: [, ],
        idCaissier: [, ],  
        idClient: [, ],
        idPos: [, ],
        codeSession: [, ],
          dateInferieure: [, Validators.required],
          dateSuperieure: [, Validators.required],

      });
      this.onChanges();
    }

    getCaissierList(idPos?: BigInt){
      this.caissierList = [];
      this.accountService.getAll().subscribe({
        next: (listUser: User[]) => {
          if(idPos != undefined){
            for(let i = 0; i < listUser.length; i++){
             if(listUser[i].idBox == idPos)
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

      this.clientService.getAll().subscribe({
        next: (listClient) => {
          this.clientList = listClient;
        },
        error: (error: any) => { }
      });
      this.getCaissierList(this.idPosSelected);
    }

    
    getData(){
      this.invoices = [];
     
      if(this.rechercherPar == "tous"){
            this.invoiceService.getbetweenDate(this.dateInf, this.dateSup).subscribe({
              next: (listInvoices: Invoice[]) => {
                this.invoices = listInvoices;
                this.getTotalMontants();
              },
              error: (error: any) => { }
            });
          }
          else if(this.rechercherPar == "client"){
            this.invoiceService.getByClient(this.idClientSelected!, this.dateInf, this.dateSup).subscribe({
              next: (listInvoices: Invoice[]) => {
                this.invoices = listInvoices;
                this.getTotalMontants();
              },
              error: (error: any) => { }
            });
          }
          else if(this.rechercherPar == "pos"){
            
          }
          else if(this.rechercherPar == "caissier"){
            this.invoiceService.getByEmploye(this.idCaissierSelected!, this.dateInf, this.dateSup).subscribe({
              next: (listInvoices: Invoice[]) => {
                this.invoices = listInvoices;
                this.getTotalMontants();
              },
              error: (error: any) => { }
            });
          }
          else if(this.rechercherPar == "session"){
            this.sessionService.getAll().subscribe({
              next: (listSessions) => {
                for(let i = 0; i < listSessions.length; i++){
                  if(listSessions[i].code == this.codeSessionSelected){
                    this.idSessionSelected = listSessions[i].id;

                    this.invoiceService.getbetweenDate(this.dateInf, this.dateSup).subscribe({
                      next: (listInvoices: Invoice[]) => {
                        for(let a = 0; a < listInvoices.length; a++){
                          if(listInvoices[a].idSession == this.idSessionSelected){
                            this.invoices.push(listInvoices[a]);
                          }
                        }
                        this.getTotalMontants();
                      },
                      error: (error: any) => { }
                    });

                  }
                }
              },
              error: (error: any) => { }
            });
            
      console.log('idsession : '+this.idSessionSelected, this.codeSessionSelected);
          }
    }

    getTotalMontants(){
      this.totalMontant = 0;
      this.totalMontantAPayer = 0;
      this.totalRemise = 0;
      for(let i = 0; i < this.invoices.length; i++){
        this.totalMontant = this.totalMontant + this.invoices[i].montantTotal!;
        this.totalMontantAPayer = this.totalMontantAPayer + this.invoices[i].montantAPayer!;
        this.totalRemise = this.totalRemise + this.invoices[i].remise!;
        this.totalTva = this.totalTva + this.invoices[i].tva!;
      }
    }
    onChanges(): void {
      this.formFacturation.valueChanges.subscribe(val => {
        if( this.formFacturation.get('idPos')?.value !=undefined){
          this.idPosSelected = this.formFacturation.get('idPos')?.value;//id
        }
        if( this.formFacturation.get('idClient')?.value !=undefined){
          this.idClientSelected = this.formFacturation.get('idClient')?.value;//id
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
        this.rechercherPar = this.formFacturation.get('rechercherPar')?.value;
        if(this.formFacturation.get('codeSession')?.value != undefined){
          this.codeSessionSelected = this.formFacturation.get('codeSession')?.value;
        }
        
      this.getCaissierList(this.idPosSelected)
      });

    }
  
    get fFacturation() { return this.formFacturation.controls; }
    onSubmit() {
        this.submitted = true;
        
        this.getData();
        this.submitting = true;
        
        this.submitting = false;
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
          }
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

    exportExcel() {
      console.log("*********");
      let venteArticlesNew:any = this.invoices;
      
      var datePipe = new DatePipe("en-US");
      for(let i = 0; i < venteArticlesNew.length; i++){
        venteArticlesNew[i].date =  datePipe.transform(venteArticlesNew[i].date, 'dd/MM/yyyy: hh:mm');
      }
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.invoices);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

      // Convertir le workbook en blob
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Télécharger le fichier Excel
      const fileName: string = 'export.xlsx';
      saveAs(blob, fileName);
    }

    
    loadImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }

    exportPDF(){
      const doc = new jsPDF('landscape');//mettre le doc en paysage
    let invoicesNew:any = this.invoices;//mettre le contenu dans une autre variable pour pouvoir ajouter le champ nom de categorie d'article
    /*for(let i = 0; i < venteArticlesNew.length; i++){
      venteArticlesNew[i].nomArticle = this.getNomArticleById(venteArticlesNew[i].idArticle);
    }*/
     // Page properties
     const pageWidth = doc.internal.pageSize.getWidth();
     const pageHeight = doc.internal.pageSize.getHeight();

    //**************************entete**********************************************************************************************************************************************
      // Coordonnées de positionnement de l'image
      const xImage = 10;
      const yImage = 10;

      // Dimensions de l'image
       const heightImage = 30;
       let widthImage!: number;
      let urlImage =  `${environment.apiUrl}/api/auth/download?chemin=`+this.entreprise?.image?.replace(/\\/g, '/');
     this.loadImage(urlImage)
      .then(img => {
        const aspectRatio = img.width / img.height;
        widthImage = heightImage * aspectRatio;

        doc.addImage(urlImage, 'JPEG', xImage, yImage, widthImage, heightImage);
        doc.setFontSize(8);
        doc.text(this.entreprise.nom!,
          widthImage+xImage+5,//x
          yImage+3,//y
        ); 

        doc.text(this.entreprise.texte1!,
          widthImage+xImage+5,//x
          yImage+8,//y
        ); 

        doc.text(this.entreprise.texte3!,
          widthImage+xImage+5,//x
          yImage+13,//y
        ); 

          //**************************Corps**********************************************************************************************************************************************
        //ajoute le titre au document
        doc.setFont('bold');
        doc.setFontSize(15);
        var datePipe = new DatePipe("en-US");
        doc.text('Liste des facturations'+' du '+datePipe.transform(this.dateInf, 'dd/MM/yyyy')+' au '+datePipe.transform(this.dateSup, 'dd/MM/yyyy'),
        doc.internal.pageSize.getWidth() / 2,//centrer le texte
                  widthImage,//y
                  {
                    align: 'center',
                  }
                  ); 
       

        // Configuration des styles du tableau
        const styles = {
          font: 'helvetica',
          lineColor: [0, 0, 0],
          lineWidth: 0.1,//epaisseur des bordures
          fillColor: [176, 224, 230],
          textColor: [0, 0, 0],
          fontSize: 10,
        };
        
        // Configuration des styles de l'en-tête du tableau
        const headerStyles = {
          fontStyle: 'bold',
          fillColor: [176, 224, 230],
          textColor: [0, 0, 0],
        };
        
        // Configuration des styles du corps du tableau
        const bodyStyles = {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 8,
        };
        
        //caster dans une autre variable pour pouvoir l'ajouter au document
        let tableData = invoicesNew.map((item: { code: any; montantTotal: any; remise: any; tva:any; montantAPayer: any; date: any })=> [item.code, item.montantTotal, item.remise, item.tva, item.montantAPayer, datePipe.transform(item.date, 'dd/MM/yyyy: hh:mm')]);
        
        // Génération du tableau avec les styles configurés
        let enteteTab = ['Code', 'Montant total'+'('+this.entreprise.monnaie+')', 'Remise'+'('+this.entreprise.monnaie+')', 'TVA'+'('+this.entreprise.monnaie+')', 'Montant à payer'+'('+this.entreprise.monnaie+')', 'Date'];
       
        (doc as any).autoTable({
          head: [enteteTab],
          body: tableData,
          theme: 'grid',
          startY: yImage+widthImage+1,//bordure haute
          styles: styles,
          headStyles: headerStyles,
          bodyStyles: bodyStyles,
        });

         //**************************totaux**********************************************************************************************************************************************
         doc.setFontSize(9);
         doc.setFont('helvetica');
         
         doc.text('Total des montants : '+this.totalMontant+' '+this.entreprise.monnaie,  30, pageHeight - 45 );
         doc.text('Total des remises : '+this.totalMontant+' '+this.entreprise.monnaie,  30, pageHeight - 40);
         doc.text('Total des TVA : '+this.totalTva+' '+this.entreprise.monnaie,  30, pageHeight - 35);
         doc.text('Total des montants payés : '+this.totalMontant+' '+this.entreprise.monnaie,  30, pageHeight - 30);

        
         

          //**************************pied de page**********************************************************************************************************************************************
          let footerText = '';
          doc.setFontSize(9);
          doc.setFont('helvetica');
        // Options de positionnement du bas de page
        const footerOptions = {
          align: 'center',
        };

       
        footerText+=this.entreprise.nom; //ajoute le nom
        if(this.entreprise.formeJuridique != undefined && this.entreprise.formeJuridique !=''){
          footerText+this.entreprise.formeJuridique; //ajoute la forme juridique
        } 
        
        if(this.entreprise.texte2 != undefined && this.entreprise.texte2! !=''){
          footerText+=' au capital de '+this.entreprise.texte2+' '+this.entreprise.monnaie;//capital
        }
        
        if(this.entreprise.ville != undefined && this.entreprise.ville !=''){
          footerText+=' - '+this.entreprise.ville; //Adresse
        } 
        
        if(this.entreprise.ifu != undefined && this.entreprise.ifu !=''){
          footerText+=' IFU: '+this.entreprise.ifu; //ifu
        }

        if(this.entreprise.rccm != undefined && this.entreprise.rccm !=''){
          footerText+=' - RCCM: '+this.entreprise.rccm; //rccm
        }
        
       
        // Ajouter le bas de page
        doc.text(footerText,  doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });

        doc.save('table.pdf');
      })
    }
}

