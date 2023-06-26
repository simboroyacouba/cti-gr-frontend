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
import { Invoice } from '@app/_models/Invoice';
import { Session } from '@app/_models/Session';

@Injectable({ providedIn: 'root' })
export class SessionService {
    
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       
    }

    //liste api pour les articles

    getIdPosByIdSession(idSession: BigInt) : BigInt {
        let idPos:BigInt = BigInt(0);
        this.getOne(idSession)
        .subscribe({
            next :(y) => {
                console.log(y);
                idPos = y.idCaisse!;
                console.log('aaa'+idPos);
            }, 
            error: error => {
                
            }
        });
        return idPos;
    }
    insert(session: Session) {
        return this.http.post<Message>(`${environment.apiUrl}/api/session/insert`, session);
    }

    getOne(id: BigInt) {
        return this.http.post<Session>(`${environment.apiUrl}/api/session/getone`, {id});
    }

    getAll() {
        return this.http.get<Session[]>(`${environment.apiUrl}/api/session/get`);
    }

    getAvtiveSession(idCaisse: BigInt) {
        return this.http.post<Session>(`${environment.apiUrl}/api/session/getactive`, {idCaisse});
    }

    closeSession(id: BigInt) {
        return this.http.post<Message>(`${environment.apiUrl}/api/session/close`, {id});
    }

}