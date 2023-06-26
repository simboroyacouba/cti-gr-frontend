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
import { Article } from '@app/_models/Article';
import { ArticleType } from '@app/_models/ArticleType';
import { Approvisionnement } from '@app/_models/approvisionnement';
import { Depacketage } from '@app/_models/depacketage';

@Injectable({ providedIn: 'root' })
export class ArticleService {
    
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       
    }

    //liste api pour les articles

    register(article: Article) {
        return this.http.post<Message>(`${environment.apiUrl}/api/article/insert`, article);
    }

    getAll(): Observable<any>{
        return this.http.get<Article[]>(`${environment.apiUrl}/api/article/get`);
    }

    getById(id: BigInt) {
        return this.http.post<Article>(`${environment.apiUrl}/api/article/getone`, {id});
    }

    update(article: Article) {
        return this.http.post<Message>(`${environment.apiUrl}/api/article/update`,article);
    }


    uploadProfilePhoto(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
    
        const req = new HttpRequest('POST', `${environment.apiUrl}/api/auth/uploadimage`, formData, {
          reportProgress: true,
          responseType: 'json',
          
        });
        return this.http.request(req);
      }
 
      //liste api pour les types d'articles

    getAllTypeArticle(): Observable<any>{
        return this.http.get<ArticleType[]>(`${environment.apiUrl}/api/articletype/get`);
    }

    registerTypeArticle(articleType: ArticleType) {
        return this.http.post<Message>(`${environment.apiUrl}/api/articletype/insert`, articleType);
    }

    updateTypeArticle(articleType: ArticleType) {
        return this.http.post<Message>(`${environment.apiUrl}/api/articletype/update`,articleType);
    }
    

    //liste des api pour le restockage
    restocker(approvisionnement: Approvisionnement) {
        return this.http.post<Message>(`${environment.apiUrl}/api/rawmaterial/restockage`, approvisionnement);
    }

    
    getOneApprovisionnement(id: BigInt){
        return this.http.post<Approvisionnement>(`${environment.apiUrl}/api/rawmaterial/getrestockage`,  {id});
    }

    getAllApprovisionnement(id: BigInt|undefined, dateinf: Date, datesup: Date){
        return this.http.post<Approvisionnement[]>(`${environment.apiUrl}/api/rawmaterial/getrestockage`, {id, dateinf, datesup});
    }

    //liste des api pour le depaquetage
    depaquetage(depacketage: Depacketage) {
        return this.http.post<Message>(`${environment.apiUrl}/api/rawmaterial/depaquetage`, depacketage);
    }

    
    getOneDepaquetage(id: BigInt): Observable<any>{
        return this.http.post<Depacketage>(`${environment.apiUrl}/api/rawmaterial/getonedepaquetage`, {id});
    }

    getAllDepaquetageBetweenDate(id: BigInt|undefined, dateinf: Date|undefined, datesup: Date|undefined): Observable<any>{
        return this.http.post<Depacketage[]>(`${environment.apiUrl}/api/rawmaterial/getdepaquetage`, {id, dateinf, datesup});
    }
}