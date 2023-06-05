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
    
}