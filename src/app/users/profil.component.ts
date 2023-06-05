import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


import { AccountService, AlertService } from '@app/_services';
import {User} from '@app/_models/user';
import { Role } from '@app/_models/role';
import { Observable } from 'rxjs/internal/Observable';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';

@Component({ templateUrl: 'profil.component.html' })

export class ProfilComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitting = false;
    submitted = false;
    changerPhoto = false;
    userConnected!: User ;
    selectedRoles=[];
    dropdownSettings:IDropdownSettings={};
    roles!: string[] | undefined;
    nomImage!: string;

    photo!:string;

    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';
  
    imageInfos?: Observable<any>;
   
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
    ) {}

    ngOnInit() {
        
   // this.imageInfos = this.accountService.getFiles();
   
       
        this.userConnected = this.accountService.userValue as User;
       // form with validation rules
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            // password only required in add mode
            password: ['', Validators.minLength(6), ],
        });
        this.onChanges();
       

            this.loading = true;
            this.accountService.getById(this.userConnected.id as BigInt)
                .subscribe((x) => {
                    this.form.patchValue(x);
                    console.log(x.roles);
                    this.roles = x.roles;
                    this.form.controls['password'].setValue("");
                    this.photo = `${environment.apiUrl}/api/auth/download?chemin=`+x.profilePhoto?.replace(/\\/g, '/');
                    this.loading = false;
                });
          
        
    }
    functionPhoto(){
      if(this.changerPhoto == false){
        return this.photo;
      }
      else{
        this.photo = this.preview;
        return this.photo;
      }
    }

    selectFile(event: any): void {
        this.message = '';
        this.preview = '';
        this.progress = 0;
        this.selectedFiles = event.target.files;
        this.changerPhoto = true;
        if (this.selectedFiles) {
          const file: File | null = this.selectedFiles.item(0);
    
          if (file) {
            this.preview = '';
            this.currentFile = file;
    
            const reader = new FileReader();
    
            reader.onload = (e: any) => {
              this.preview = e.target.result;
            };
    
            reader.readAsDataURL(this.currentFile);
          }
        }
      }


      uploadImage(prefixCode:string): void {
        this.progress = 0;
    
    
        if (this.selectedFiles) {
          let file: File | null = this.selectedFiles.item(0);
          
          const fileExtension = file?.name.split('.').pop();
          file = new File([file as File], prefixCode+"."+fileExtension, { type: file?.type });
          if (file) {
            this.currentFile = file;
            this.accountService.uploadProfilePhoto(this.currentFile,).subscribe({
              next: (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.progress = Math.round((100 * event.loaded) / event.total);
                } else if (event instanceof HttpResponse) {
                  this.message = event.body.message;
                 // this.imageInfos = this.accountService.getFiles();
                }
              },
              error: (err: any) => {
                this.progress = 0;
    
                if (err.error && err.error.message) {
                  this.message = err.error.message;
                } else {
                  this.message = 'Could not upload the image!';
                }
    
                this.currentFile = undefined;
              },
            });
          }
    
          this.selectedFiles = undefined;
        }
      }

      
      public itemsToString(value:Array<any> = []):string {
        return value
          .map((item:any) => {
            return item.text;
          }).join(',');
      }

    onChanges(): void {
        this.form.valueChanges.subscribe(val => {
            this.userConnected = new User(this.userConnected.id,
                                    '',//Code
                                    this.form.get('firstName')?.value,//prenom
                                     this.form.get('lastName')?.value,//nom
                                      this.form.get('username')?.value,//nom d'utilisateur
                                       this.form.get('password')?.value,//mot de passe
                                        this.form.get('email')?.value,//email
                                        undefined,//identifiant caisse
                                         undefined,//date inscription
                                         this.form.get('rolesSelectedOnForm')?.value.map((role: Role) => role.name) ,//role
                                           undefined) ;//jeton

          });
    }
    

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.saveUser()
            /*.subscribe({
                next: (x) => {
                    this.uploadImage('EMP'+x);
                    this.alertService.success('User saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/users');
                },
                error: error => {
                    
                }
            })*/
                    this.submitting = false;
    }

    private updateUser(){
        this.accountService.update(this.userConnected)
        .subscribe({
            next: (x) => {
            this.uploadImage('EMP'+x.message);
            this.alertService.success('User saved', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/users');
        },
        error: error => {
            this.alertService.error(error);
        }
    });
    }
    


    private saveUser() {
        // update user 
        return this.updateUser()
            
    }
}
