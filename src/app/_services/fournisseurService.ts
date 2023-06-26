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
import { Fournisseur } from '@app/_models/Fournisseur';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
    
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       
    }

    //liste api pour les articles

    insert(fournisseur: Fournisseur) {
        return this.http.post<Message>(`${environment.apiUrl}/api/provider/insert`, fournisseur);
    }

    insertMultiple(fournisseur: Fournisseur[]) {
        return this.http.post<Message>(`${environment.apiUrl}/api/provider/insertmultiple`, fournisseur);
    }

    getAll(): Observable<any>{
        return this.http.get<Fournisseur[]>(`${environment.apiUrl}/api/provider/get`);
    }

    getById(id: BigInt): Observable<any>{
        return this.http.post<Fournisseur>(`${environment.apiUrl}/api/provider/getone`, {id});
    }

    update(fournisseur: Fournisseur): Observable<any>{
        return this.http.post<Fournisseur>(`${environment.apiUrl}/api/provider/update`, fournisseur);
    }

}