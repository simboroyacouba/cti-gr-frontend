import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';

@Component({ 
    templateUrl: 'list-vente.component.html',
    styleUrls: ['list-vente.component.scss'],
})

export class ListVenteComponent implements OnInit {
    pos!: Pos[];
    entreprise!:Entreprise;
    constructor(
        private  posService: PosService
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.posService.getAll().subscribe({
        next: (value: Article[]) => this.pos = value,
        error: (error: any) => { }
      });
      
       
      console.log("*****************"+this.pos);
      console.log("*****************"+this.entreprise);
    }

      pageChang(){
       // this.entrepriseService.getEntreprise();
        console.log(localStorage.getItem('entreprise')) ;
      }
    
  
}