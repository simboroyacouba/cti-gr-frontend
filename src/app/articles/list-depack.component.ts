import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Depacketage } from '@app/_models/depacketage';
import { MatDialog } from '@angular/material/dialog';
import { dialogDepack } from '@app/_components/dialogDepack/dialogApprov';

@Component({ 
    templateUrl: 'list-depack.component.html',
    styleUrls: ['list-article.component.scss'],
})

export class ListDepackComponent implements OnInit {
    articles!: Article[];
    entreprise!:Entreprise;
    depacketages: Depacketage[] = [];
    form!: FormGroup;
    appro!: string;
    dateInf!: Date;
    dateSup!: Date;
    loading = false;
    submitted = false;
    submitting = false;
    constructor(
        private  articleService:  ArticleService, 
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
    
      this.getOperations();
      this.getArticles();
     
      this.form = this.formBuilder.group({
       // appro: ['', Validators.required],
        dateInferieure: [, Validators.required],
        dateSuperieure: [, Validators.required],
      });
      this.onChanges();
    }

    getArticles(){
      this.articleService.getAll().subscribe({
        next: (value) =>{
          this.articles = value; 
        },
        error: (error: any) => { }
      });
    }

    getOperations(){
      this.articleService.getAllDepaquetageBetweenDate(undefined, this.dateInf,this.dateSup).subscribe({
        next: (value) =>{
          this.depacketages = value; 
        },
        error: (error: any) => { }
      });
    }
      pageChang(){
      }
      getNomArticleById(id:BigInt): string{
        let nom = '';
        for(let i = 0; i < this.articles.length; i++){
          if(this.articles[i].id == id){
            nom = this.articles[i].nom!;
          }
        }
        return nom;
      }
  
      voirDetails(id: BigInt){
        let depack!: any;
        for(let y = 0; y < this.depacketages.length; y++){
          if(this.depacketages[y].id == id ){
            depack = this.depacketages[y];
            depack.nomAjout = this.getNomArticleById(depack.idArticleAjout);
            depack.nomDimunition = this.getNomArticleById(depack.idArticleDimunition);
          }
        }
        this.dialog.open(dialogDepack, {
          data: {
            titre: "Détails",
            element: depack!,
          },
        });
      }

      onChanges(): void {
        this.form.valueChanges.subscribe(val => {
          /*if( this.form.get('appro')?.value !=undefined){
            this.appro = this.form.get('appro')?.value;//id
          }*/
          if(this.form.get('dateInferieure')?.value != undefined){
            this.dateInf = this.form.get('dateInferieure')?.value;
          }
          if(this.form.get('dateSuperieure')?.value != undefined){
            this.dateSup = this.form.get('dateSuperieure')?.value;
          } 
        });
      }
    
      get f() { return this.form.controls; }
   
      getData(){
        this.submitted = true;
        this.submitting = true;
        if (this.form.invalid) {
          this.submitting = false;
          return;
        }
        this.getOperations();
        this.submitting = false;
      }
}