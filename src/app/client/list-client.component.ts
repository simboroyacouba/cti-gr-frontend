import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';
import { Client } from '@app/_models/Client';
import { ClientService } from '@app/_services/clientService';

@Component({ 
    templateUrl: 'list-client.component.html',
    styleUrls: ['list-client.component.scss'],
})

export class ListClientComponent implements OnInit {
    clients!: Client[];
    entreprise!:Entreprise;
    constructor(
        private  posService: PosService,
        private clientService: ClientService
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.clientService.getAll().subscribe({
        next: (value: Client[]) => this.clients = value,
        error: (error: any) => { }
      });
      
       
    }

    
  
}