import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { AccountService } from '@app/_services';

import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { ArticleType } from '@app/_models/ArticleType';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({ 
    templateUrl: 'list-article.component.html',
    styleUrls: ['list-article.component.scss'],
})

export class ListArticleComponent implements OnInit {
    searchForm!: FormGroup;
    textRecherche!: string;
    desactivating = false;
    loading = false;
    articles!: Article[];
    articlesGlobal!: Article[];
    entreprise!:Entreprise;
    typesArticles!: ArticleType[];
    constructor(
      private formBuilder: FormBuilder,
        private  articleService:  ArticleService,
        private accountService: AccountService
    ) {}

    ngOnInit() {
      this.getEntreprise();
      this.getArticles();
      this.articleService.getAllTypeArticle().subscribe({
        next: (value: ArticleType[]) => {
         this.typesArticles = value;
        },
        error: (error: any) => { }
      });
      this.searchForm = this.formBuilder.group({
        textRecherche: ['',],
      })
      
      this.recherche();
    }
    activateDesactivate(idArticle: BigInt){
      this.desactivating = true;
      let art = new Article();
      art.id = idArticle;
      this.articleService.getById(idArticle).subscribe({
        next: (value) => {
          art = value;
          art.actif = !art.actif;
          this.articleService.update(art).subscribe({
            next: (value) => {
              this.desactivating = false;
            },
            error: (error: any) => { }
        });
        },
        error: (error: any) => { }
      });
    }
    getArticles(){
      this.articleService.getAll().subscribe({
              next: (value: Article[]) => {
                this.articles = value;
                this.articlesGlobal = value;
              },
              error: (error: any) => { }
      });
    }
    getEntreprise(){
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.accountService.getEntreprise()
      .subscribe((x) => {
          this.entreprise = x;
      });
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
      pageChang(){
      }
    
      exportExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.articles);
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

      exportPDF(client:boolean){
        const doc = new jsPDF('landscape');//mettre le doc en paysage
      let articleTableau: any = this.articles; //mettre le contenu dans une autre variable pour pouvoir ajouter le champ nom de categorie d'article
        
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
          doc.text('Liste des articles',
          doc.internal.pageSize.getWidth() / 2,//centrer le texte
                    widthImage,//y
                    {
                      align: 'center',
                    }
                    ); 
         
          //recuperer le nom des categories d'articles
          for(let i = 0; i < articleTableau.length; i++){
            articleTableau[i].categorie = this.getNomCatArticleByCategorieId(articleTableau[i].idTypeArticle);
          }

          //caster dans une autre variable pour pouvoir l'ajouter au document
          let tableData;
          if(client == true){ 
            tableData = articleTableau.map((item: { nom: any; prixVente: any; categorie: any })=> [item.nom, item.prixVente, item.categorie]);
           }
          else if(client == false){ 
            tableData = articleTableau.map((item: { code: any; nom: any; codeBar: any; prixVente: any; prixAchat: any; categorie: any; stock: any; })=> [item.code, item.nom, item.codeBar, item.prixVente, item.prixAchat, item.categorie, item.stock]);
          }
          

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
          
          // Génération du tableau avec les styles configurés
          let enteteTab;

          if(client == true){ 
            enteteTab = ['nom', 'prixVente'+'('+this.entreprise.monnaie+')', 'Catégorie'];
          }
          else if(client == false){ 
            enteteTab = ['code', 'nom', 'codeBar', 'prixVente'+'('+this.entreprise.monnaie+')', 'prixAchat'+'('+this.entreprise.monnaie+')', 'Catégorie', 'stock'];
          }

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

      getNomCatArticleByCategorieId(idCategorie: BigInt): string{
        let nomArticleType: string = 'a';
        for(let i = 0; i < this.typesArticles.length; i++){
          if(this.typesArticles[i].id == idCategorie){
            console.log(this.typesArticles[i].nom!);
            nomArticleType = this.typesArticles[i].nom!;
            break;
          }
        }
        return nomArticleType;
      }
}


