import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { VenteArticle } from '@app/_models/VenteArticle';
import { InvoiceService } from '@app/_services/invoice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {formatDate} from '@angular/common';

@Component({ 
    templateUrl: 'rapportVente.component.html',
    styleUrls: ['rapportVente.component.scss'],
})

export class RapportVenteComponent implements OnInit {
    venteArticles!: VenteArticle[];//contient la liste des articles vendus 
    venteArticleGroupe!: VenteArticle[];//contient la liste des articles vendus groupés pour avour les quantitées
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
    ) {}

    ngOnInit() {
      this.venteArticleGroupe = [];
      //this.dateInf = new Date;
      const currentDate = new Date();
      this.dateInf = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      this.dateSup = new Date;

      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      
      this.getData();
     
      
      this.articleService.getAll().subscribe({
        next: (value: Article[]) => this.articles = value,
        error: (error: any) => { }
      });
      this.groupData();
      
      
      this.form = this.formBuilder.group({
          idArticle: [, ],
          dateInferieure: [, Validators.required],
          dateSuperieure: [, Validators.required],

      });
      this.onChanges();
    }

    groupData(){
      if(this.venteArticles != undefined){
        /*for(let i = 0; i < this.venteArticles.length; i++){
          if(this.venteArticleGroupe.length == 0){
            this.venteArticleGroupe.push(this.venteArticles[i]);
          }
          else{
            
            for(let a = 0; a < this.venteArticleGroupe.length; a++){
              if(this.venteArticles[i].idArticle == this.venteArticleGroupe[a].idArticle){
               // console.log('###'+this.venteArticles[i].quantite);
                //console.log('***'+this.venteArticleGroupe[a].quantite);
                let itemToUpdate = this.venteArticleGroupe.find(item => item.idArticle == this.venteArticles[i].idArticle);
                if (itemToUpdate) {
                    itemToUpdate.quantite = itemToUpdate.quantite!+this.venteArticles[i].quantite!;
                }
              }
              else{
                
                //this.venteArticleGroupe.push(this.venteArticles[i]);
              }
            }
          }
        }*/
        console.log(this.venteArticles);
        for(let i = 0; i < this.venteArticles.length; i++){
           let itemToUpdate = this.venteArticleGroupe.find(item => item.idArticle == this.venteArticles[i].idArticle);
            if (itemToUpdate) {
                itemToUpdate.quantite = itemToUpdate.quantite!+this.venteArticles[i].quantite!;
            }else{
              this.venteArticleGroupe.push(this.venteArticles[i]);
            }
          }
          console.log(this.venteArticleGroupe);
        }
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
    getData(){
      
      if(this.idArticle == undefined){
        this.invoiceService.getSaleBetweenDate(this.dateInf, this.dateSup).subscribe({
          next: (value: VenteArticle[]) =>{
            this.venteArticles = value; 
            this.groupData(); 
          } ,
          error: (error: any) => { }
        });
     }
     else{
       this.invoiceService.getSaleArticleBetweenDate(this.idArticle, this.dateInf, this.dateSup).subscribe({
         next: (value: VenteArticle[]) => this.venteArticles = value,
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
    onSubmit() {
        this.submitted = true;
        

        this.submitting = true;
        
        this.submitting = false;
    }
     
  
}