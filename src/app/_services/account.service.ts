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
import { Entreprise } from '@app/_models/Entreprise';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    private entrepriseSubject: BehaviorSubject<Entreprise | null>;
    public entreprise: Observable<Entreprise | null>;
    
    headers= new HttpHeaders()

    constructor(
        private router: Router,
        private http: HttpClient,
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();

        this.entrepriseSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('entreprise')!));
        this.entreprise = this.entrepriseSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }
   
    public get entreprisegetValue() {
        return this.entrepriseSubject.value;
    }

        //
        getEntreprise() {
            console.log("############");
            return this.http.get<Entreprise>(`${environment.apiUrl}/api/entreprise/get`)                 
        }
        updateentreprise(entreprise: Entreprise) {
            return this.http.post<Message>(`${environment.apiUrl}/api/entreprise/update`,entreprise);
        }
    
       
        uploadProfilePhotoentreprise(file: File): Observable<HttpEvent<any>> {
            const formData: FormData = new FormData();
            formData.append('file', file);
        
            const req = new HttpRequest('POST', `${environment.apiUrl}/api/auth/uploadimage`, formData, {
              reportProgress: true,
              responseType: 'json',
              
            });
            return this.http.request(req);
          }    
        //



    login(username: string, password: string) {
       
        this.getEntreprise().subscribe({
            next: (value: Entreprise) =>  localStorage.setItem('entreprise', JSON.stringify(value)),
            error: (error: any) => { }
          })

        
        return this.http.post<User>(`${environment.apiUrl}/api/auth/signin`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        localStorage.removeItem('entreprise');
        this.entrepriseSubject.next(null);
        this.router.navigate(['/account/login']);
        
    }

    register(user: User) {
        return this.http.post<Message>(`${environment.apiUrl}/api/auth/signup`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/auth/getallusers` );
    }

    getById(id: BigInt) {
        return this.http.post<User>(`${environment.apiUrl}/api/auth/getusersbyid`, {id});
    }

    update(user: User) {
        return this.http.post<Message>(`${environment.apiUrl}/api/auth/updateuser`, user);
    }

    activateDesactivate(user: User) {
        return this.http.post(`${environment.apiUrl}/api/auth/activatedesactivate`, user);
    }



    getAllRoles() {
        return this.http.get<Role[]>(`${environment.apiUrl}/api/auth/getallroles` );
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
    
      

}