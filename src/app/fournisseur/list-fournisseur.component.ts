import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';
import { Client } from '@app/_models/Client';
import { ClientService } from '@app/_services/clientService';
import { Fournisseur } from '@app/_models/Fournisseur';
import { FournisseurService } from '@app/_services/fournisseurService';

@Component({ 
    templateUrl: 'list-fournisseur.component.html',
    styleUrls: ['list-fournisseur.component.scss'],
})

export class ListFournisseurComponent implements OnInit {
  fournisseurs!: Fournisseur[];
    entreprise!:Entreprise;
    constructor(
        private  posService: PosService,
        private fournisseurService: FournisseurService
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.fournisseurService.getAll().subscribe({
        next: (value: Client[]) => this.fournisseurs = value,
        error: (error: any) => { }
      });
      
       
    }

    
  
}