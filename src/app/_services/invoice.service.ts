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

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       
    }

    //liste api pour les articles

    insert(invoice: Invoice) {
        return this.http.post<Message>(`${environment.apiUrl}/api/invoice/insert`, invoice);
    }

    addamount(invoice: Invoice): Observable<any>{
        return this.http.post<Invoice>(`${environment.apiUrl}/api/invoice/addamout`, invoice);
    }

   close(id: BigInt) {
        return this.http.post<Invoice>(`${environment.apiUrl}/api/invoice/close`, {id});
    }

    getActiveInvoice(): Observable<any>{
        return this.http.get<Invoice[]>(`${environment.apiUrl}/api/invoice/getactive`);
    }

    getByClient(id: BigInt, dateinf: Date, datesup: Date): Observable<any>{
        return this.http.post<Invoice[]>(`${environment.apiUrl}/api/invoice/getbyclientid`, {id, dateinf, datesup});
    }

    getByEmploye(id: BigInt, dateinf: Date, datesup: Date): Observable<any>{
        return this.http.post<Invoice[]>(`${environment.apiUrl}/api/invoice/getbyemployeid`, {id, dateinf, datesup});
    }

    getbetweenDate(dateinf: Date, datesup: Date): Observable<any>{
        let id = undefined;
        return this.http.post<Invoice[]>(`${environment.apiUrl}/api/invoice//getbetweendate`, {id, dateinf, datesup});
    }

    insertArticle(article: Article) {
        return this.http.post<Message>(`${environment.apiUrl}/api/sale/insert`, article);
    }
    
    // api pour recuperer les ventes d'articles
    getSaleArticleBetweenDate(id: BigInt, dateinf: Date, datesup: Date): Observable<any>{
        return this.http.post<VenteArticle[]>(`${environment.apiUrl}/api/sale/getbyarticleid`, {id, dateinf, datesup});
    }

    getSaleBetweenDate(dateinf: Date, datesup: Date): Observable<any>{
        return this.http.post<VenteArticle[]>(`${environment.apiUrl}/api/sale/get`, {dateinf, datesup});
    }
}