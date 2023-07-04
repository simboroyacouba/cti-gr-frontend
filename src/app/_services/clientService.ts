import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Role } from '@app/_models/role';
import { Message } from '@app/_models/message'; 
import { Photo } from '@app/_models/photo';
import { Invoice } from '@app/_models/Invoice';
import { ArticleType } from '@app/_models/ArticleType';
import { Article } from '@app/_models/Article';
import { VenteArticle } from '@app/_models/VenteArticle';
import { Client } from '@app/_models/Client';

@Injectable({ providedIn: 'root' })
export class ClientService {
    
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       
    }

    //liste api pour les articles

    insert(client: Client) {
        return this.http.post<Message>(`${environment.apiUrl}/api/customer/insert`, client);
    }

    insertMultiple(client: Client[]) {
        return this.http.post<Message>(`${environment.apiUrl}/api/customer/insertmultiple`, client);
    }

    getAll(): Observable<any>{
        return this.http.get<Client[]>(`${environment.apiUrl}/api/customer/get`);
    }

    getById(id: BigInt): Observable<any>{
        return this.http.post<Client>(`${environment.apiUrl}/api/customer/getone`, {id});
    }

    update(client: Client): Observable<any>{
        let id = undefined;
        return this.http.post<Client[]>(`${environment.apiUrl}/api/customer/update`, client);
    }

    insertArticle(article: Article) {
        return this.http.post<Message>(`${environment.apiUrl}/api/sale/insert`, article);
    }
    
    getBirthdayToday(): Observable<any>{//client dont l'anniversaire est aujourd'hui
        return this.http.get<Client[]>(`${environment.apiUrl}/api/customer/getbirthdaytoday`);
    }

    getBirthday01(): Observable<any>{//client dont l'anniversaire ent du 01 au 15 du mois
        return this.http.get<Client[]>(`${environment.apiUrl}/api/customer/getbirthday01`);
    }

    getBirthday02(): Observable<any>{//client dont l'anniversaire ent du 15 a la fin du mois
        return this.http.get<Client[]>(`${environment.apiUrl}/api/customer/getbirthday02`);
    }
}