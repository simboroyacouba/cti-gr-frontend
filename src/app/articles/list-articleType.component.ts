import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { ArticleType } from '@app/_models/ArticleType';

@Component({ 
    templateUrl: 'list-articleType.component.html',
    styleUrls: ['list-article.component.scss'],
})

export class ListArticleTypeComponent implements OnInit {
    articlesType!: ArticleType[];
    entreprise!:Entreprise;
    constructor(
        private  articleService:  ArticleService
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.articleService.getAllTypeArticle().subscribe({
        next: (value: ArticleType[]) => this.articlesType = value,
        error: (error: any) => { }
      });
      
       
    }

      pageChang(){
       // this.entrepriseService.getEntreprise();
        console.log(this.articlesType) ;
      }
    
  
}