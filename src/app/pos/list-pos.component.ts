import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';

@Component({ 
    templateUrl: 'list-pos.component.html',
    styleUrls: ['list-pos.component.scss'],
})

export class ListPosComponent implements OnInit {
    articles!: Article[];
    entreprise!:Entreprise;
    constructor(
        private  articleService:  ArticleService
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.articleService.getAll().subscribe({
        next: (value: Article[]) => this.articles = value,
        error: (error: any) => { }
      });
      
       
      console.log("*****************"+this.articles);
      console.log("*****************"+this.entreprise);
    }

      pageChang(){
       // this.entrepriseService.getEntreprise();
        console.log(localStorage.getItem('entreprise')) ;
      }
    
  
}