import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { Approvisionnement } from '@app/_models/approvisionnement';
import { formatDate } from '@angular/common';
import { dialogView } from '@app/_components/dialogView/dialogView';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { dialogApprov } from '@app/_components/dialogApprov/dialogApprov';
import { AccountService } from '@app/_services';


@Component({ 
    templateUrl: 'list-approv.component.html',
    styleUrls: ['list-article.component.scss'],
})

export class ListApprovComponent implements OnInit {
  approvisionnements: Approvisionnement[] = [];
    entreprise!:Entreprise;
    form!: FormGroup;
    articles: Article[] = [];
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
        private accountService: AccountService,
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
     /* let dateSup = formatDate(new Date(),'dd/MM/yyyy', 'fr');
      let dateinf1 = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
      let dateinf = formatDate(new Date(),'dd/MM/yyyy', 'fr')
      */
      this.getArticles();
      this.articleService.getAllApprovisionnement(undefined, new Date(2023, 1, 1), new Date(2023, 7, 1)).subscribe({
        next: (value) =>{
          this.approvisionnements = value; 
        },
        error: (error: any) => { }
      });

      this.accountService.getEntreprise()
      .subscribe((x) => {
          this.entreprise = x;
      });

      this.form = this.formBuilder.group({
        appro: ['', Validators.required],
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
  
      invoiceInfo(id: BigInt){
        let ravitaillement!: any;
        for(let y = 0; y < this.approvisionnements.length; y++){
          if(this.approvisionnements[y].id == id ){
            ravitaillement = this.approvisionnements[y];
            ravitaillement.nom = this.getNomArticleById(ravitaillement.idArticle!);
          }
        }
        console.log(ravitaillement.code);
        this.dialog.open(dialogApprov, {
          data: {
            titre: "Détails",
            element: ravitaillement!,
          },
        });
      }

      onChanges(): void {
        this.form.valueChanges.subscribe(val => {
          if( this.form.get('appro')?.value !=undefined){
            this.appro = this.form.get('appro')?.value;//id
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
   
      getData(){
        this.submitted = true;
        this.submitting = true;
        if (this.form.invalid) {
          this.submitting = false;
          return;
        }
        
        this.articleService.getAllApprovisionnement(undefined, this.dateInf,this.dateSup).subscribe({
          next: (value) =>{
            this.approvisionnements = [];
            if(this.appro == 'tout'){
              this.approvisionnements = value; 
            }
            else if(this.appro == 'approvisionnement'){
              for(let y = 0; y < value.length; y++){
                if(value[y].ravitaillement == true ){
                  this.approvisionnements.push(value[y]);
                }
              }
            }
            else if(this.appro == 'desapprovisionnement'){
              for(let y = 0; y < value.length; y++){
                if(value[y].ravitaillement == false ){
                  this.approvisionnements.push(value[y]);
                }
              }
            }
            
            console.log(this.approvisionnements);
          },
          error: (error: any) => { }
        });
        this.submitting = false;
      }

   
}