import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { Entreprise } from '@app/_models/Entreprise';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';
import { Client } from '@app/_models/Client';
import { ClientService } from '@app/_services/clientService';
import { formatDate } from '@angular/common';

@Component({ 
    templateUrl: 'list-anniversaireclient.component.html',
    styleUrls: ['list-client.component.scss'],
})

export class ListAnniversaireClientComponent implements OnInit {
    clientsAnniversaireToday!: Client[];
    clientsAnniversaire01!: Client[];
    clientsAnniversaire02!: Client[];
    entreprise!:Entreprise;
    constructor(
        private  posService: PosService,
        private clientService: ClientService
    ) {}

    ngOnInit() {
      this.entreprise = JSON.stringify(localStorage.getItem('entreprise')) as unknown as Entreprise;
      this.clientService.getBirthdayToday().subscribe({
        next: (value: Client[]) => this.clientsAnniversaireToday = value,
        error: (error: any) => { }
      });

      this.clientService.getBirthday01().subscribe({
        next: (value: Client[]) =>{
          this.clientsAnniversaire01=[];
          for(let a = 0; a < value.length ;a++){
            if (formatDate(value[a].dateAnniversaire!,'MM-dd','en_US') > formatDate(new Date(),'MM-dd','en_US')) {
              this.clientsAnniversaire01.push(value[a]);
            } 
          }
        } ,
        error: (error: any) => { }
      });

      this.clientService.getBirthday02().subscribe({
        next: (value: Client[]) =>{
          this.clientsAnniversaire02=[];
          for(let a = 0; a < value.length ;a++){
            if (formatDate(value[a].dateAnniversaire!,'MM-dd','en_US') > formatDate(new Date(),'MM-dd','en_US')) {
              this.clientsAnniversaire02.push(value[a]);
            } 
          }
        } ,
        error: (error: any) => { }
      });
      
       
    }

    
  
}