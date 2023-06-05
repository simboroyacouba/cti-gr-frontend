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
import { ArticleType } from '@app/_models/ArticleType';
import { Pos } from '@app/_models/pos';

@Injectable({ providedIn: 'root' })
export class PosService {
    
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       
    }

    //liste api pour les articles

    register( pos:  Pos) {
        return this.http.post<Message>(`${environment.apiUrl}/api/box/insert`,  pos);
    }

    addUserToBox(idUser: BigInt, idBox: BigInt) {
        return this.http.post<Message>(`${environment.apiUrl}/api/box/addusertobox`,  {idUser, idBox});
    }

    removeUserToBox(id: BigInt) {
        return this.http.post<Message>(`${environment.apiUrl}/api/box/removeusertobox`,  {id});
    }

    getAll(): Observable<any>{
        return this.http.get< Pos[]>(`${environment.apiUrl}/api/box/get`);
    }

    getById(id: BigInt) {
        return this.http.post< Pos>(`${environment.apiUrl}/api/box/getone`, {id});
    }

    update( pos:  Pos) {
        return this.http.post<Message>(`${environment.apiUrl}/api/box/update`,pos);
    }
}