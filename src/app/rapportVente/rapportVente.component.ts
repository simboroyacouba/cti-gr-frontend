import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { VenteArticle } from '@app/_models/VenteArticle';
import { InvoiceService } from '@app/_services/invoice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DatePipe, formatDate} from '@angular/common';
import { AccountService } from '@app/_services';

import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { ArticleType } from '@app/_models/ArticleType';
import { environment } from '@environments/environment';


@Component({ 
    templateUrl: 'rapportVente.component.html',
    styleUrls: ['rapportVente.component.scss'],
})

export class RapportVenteComponent implements OnInit {
    venteArticles!: VenteArticle[];//contient la liste des articles vendus 
    venteArticleGroupe!: VenteArticle[];//contient la liste des articles vendus groupés pour avoir les quantitées
    form!: FormGroup;
    articles!: Article[];
    entreprise!:Entreprise;
    dateInf!: Date;
    dateSup!: Date;
    loading = false;
    submitted = false;
    submitting = false;
    idArticle?: BigInt;
    constructor(
        private invoiceService: InvoiceService,
        private articleService: ArticleService, 
        private formBuilder: FormBuilder,
        private accountService: AccountService,
    ) {}

    ngOnInit() {
      this.venteArticleGroupe = [];
      //this.dateInf = new Date;
      const currentDate = new Date();
      this.dateInf = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      this.dateSup = new Date;

      this.accountService.getEntreprise()
      .subscribe((x) => {
          this.entreprise = x;
      });
      this.getData();
     
      
      this.articleService.getAll().subscribe({
        next: (value: Article[]) => this.articles = value,
        error: (error: any) => { }
      });
      this.groupData();
      
      
      this.form = this.formBuilder.group({
          idArticle: [, ],
          dateInferieure: [, ],
          dateSuperieure: [, ],

      });
      this.onChanges();
    }

    groupData(){
      this.venteArticleGroupe = [];
      if(this.venteArticles != undefined){
        for(let i = 0; i < this.venteArticles.length; i++){
           let itemToUpdate = this.venteArticleGroupe.find(item => item.idArticle == this.venteArticles[i].idArticle);
            if (itemToUpdate) {
              itemToUpdate.quantite = itemToUpdate.quantite!+this.venteArticles[i].quantite!;
            }else{
              
              this.venteArticleGroupe.push(this.venteArticles[i]);
            }
          }
        }
        for(let i = 0; i < this.venteArticleGroupe.length; i++){
          this.venteArticleGroupe[i].tvaTotal = this.venteArticles[i].tva! * this.venteArticleGroupe[i].quantite!;
          this.venteArticleGroupe[i].prixTotal = this.venteArticleGroupe[i].prixUnitaire! * this.venteArticleGroupe[i].quantite!;
        }
        console.log(this.venteArticles);
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

    getCodeArticleById (id: BigInt) :string  {
      let code = '';
      if(this.articles != undefined){
        for(let i = 0; i<this.articles.length; i++){
          if(this.articles[i].id == id ){
            code =  this.articles[i].code!;
          }
        }
      }
      return code;
    }
    getData(){
      
      if(this.dateInf == undefined){
        const currentDate = new Date();
        this.dateInf = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      }
      if(this.dateSup == undefined){
        this.dateSup = new Date;
      }
      if(this.idArticle == BigInt(0)){
        this.invoiceService.getSaleArticleBetweenDate(undefined, this.dateInf, this.dateSup).subscribe({
          next: (value: VenteArticle[]) =>{
            this.venteArticles = [];
            this.venteArticles = value;
            this.groupData();
          },
          error: (error: any) => { }
        });
      }else{
        this.invoiceService.getSaleArticleBetweenDate(this.idArticle, this.dateInf, this.dateSup).subscribe({
        next: (value: VenteArticle[]) =>{
          this.venteArticles = [];
          this.venteArticles = value;
          this.groupData();
        },
        error: (error: any) => { }
      });
      }
      
    }

    onChanges(): void {
      this.form.valueChanges.subscribe(val => {
        if( this.form.get('idArticle')?.value !=undefined){
          this.idArticle = this.form.get('idArticle')?.value;//id
        }
        if(this.form.get('dateInferieure')?.value != undefined){
          this.dateInf = this.form.get('dateInferieure')?.value;
        }
        if(this.form.get('dateSuperieure')?.value != undefined){
          this.dateSup = this.form.get('dateSuperieure')?.value;
        } 
      });
    }
  
    get f() { return this.form.controls; }
 
    exportExcel() {
      console.log("*********");
      let venteArticlesNew:any = this.venteArticles;
      for(let i = 0; i < venteArticlesNew.length; i++){
        venteArticlesNew[i].nomArticle = this.getNomArticleById(venteArticlesNew[i].idArticle);
      }
      for(let i = 0; i < venteArticlesNew.length; i++){
        venteArticlesNew[i].codeArticle = this.getCodeArticleById(venteArticlesNew[i].idArticle);
      }
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(venteArticlesNew);
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
    let venteArticlesNew:any = this.venteArticleGroupe;//mettre le contenu dans une autre variable pour pouvoir ajouter le champ nom de categorie d'article
    for(let i = 0; i < venteArticlesNew.length; i++){
      venteArticlesNew[i].nomArticle = this.getNomArticleById(venteArticlesNew[i].idArticle);
    }
    for(let i = 0; i < venteArticlesNew.length; i++){
      venteArticlesNew[i].codeArticle = this.getCodeArticleById(venteArticlesNew[i].idArticle);
    }
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
        doc.text('Liste des ventes'+' du '+datePipe.transform(this.dateInf, 'dd/MM/yyyy')+' au '+datePipe.transform(this.dateSup, 'dd/MM/yyyy'),
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
        let tableData = venteArticlesNew.map((item: { codeArticle: any; nomArticle: any; quantite: any; prixUnitaire: any; prixTotal:any; tvaTotal: any })=> [item.codeArticle, item.nomArticle, item.quantite, item.prixUnitaire, item.prixTotal, item.tvaTotal]);
        
        // Génération du tableau avec les styles configurés
        let enteteTab = ['Code', 'Nom', 'Quantite', 'Prix unitaire'+'('+this.entreprise.monnaie+')', 'Montant total'+'('+this.entreprise.monnaie+')', 'TVA totale'+'('+this.entreprise.monnaie+')'];
       
        (doc as any).autoTable({
          head: [enteteTab],
          body: tableData,
          theme: 'grid',
          startY: yImage+widthImage+1,//bordure haute
          styles: styles,
          headStyles: headerStyles,
          bodyStyles: bodyStyles,
        });
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