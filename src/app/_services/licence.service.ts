import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Licence } from '@app/_models/Licence';

@Injectable({ providedIn: 'root' })
export class LicenceService {
    private licenceSubject!: BehaviorSubject<Licence | null>;
    public licence!: Observable<Licence | null>;
    headers= new HttpHeaders()
   
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.licenceSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('licence')!));
        this.licence = this.licenceSubject.asObservable();
    }

    public get licenceValue() {
        return this.licenceSubject.value;
    }

    get() {

        return this.http.get<Licence>(`${environment.apiUrl}/api/licence/getActiveLicence` );
    }

    insert(licence: Licence) {
        return this.http.post(`${environment.apiUrl}/api/licence/insert`, licence);
    }

}