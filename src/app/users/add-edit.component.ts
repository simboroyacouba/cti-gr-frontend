import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


import { AccountService, AlertService } from '@app/_services';
import {User} from '@app/_models/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Role } from '@app/_models/role';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: BigInt;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    userAddOrEdit!: User;
    changerPhoto = false;
    userConnected!: User | null;
    roleList!: any[];
    selectedRoleString!: String[]; 
    selectedRoles!: Role[];
    dropdownSettings:IDropdownSettings={};
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
   
       
        this.userConnected = this.accountService.userValue;
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });
        
        this.accountService.getAllRoles()
        .subscribe((x) => {
          this.roleList = x;
        });

      
          this.dropdownSettings = {
            idField: 'id',
            textField: 'name',
            selectAllText: 'Sélectionner tout',
            unSelectAllText: 'délelestionner tout',
          };
        
          //dans le cas ou il s'agit de modifier un user on recupere l'id a partir de l'url
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            rolesSelectedOnForm: ['', Validators.required],
            // password only required in add mode
            password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]],
        });
        this.onChanges();
       
        this.title = 'Ajouter un utilisateur';
        if (this.id) {
            // edit mode

            this.title = "Modifier l'utilisateur";
            this.loading = true;
            this.accountService.getById(this.id)
                .subscribe((x) => {
                    this.form.patchValue(x);
                    this.form.controls['password'].setValue("");
                    this.form.controls['rolesSelectedOnForm'].setValue(x.roles);
                    this.photo = `${environment.apiUrl}/api/auth/download?chemin=`+x.profilePhoto?.replace(/\\/g, '/');
                    this.loading = false;
                });
                
        }

        
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
          this.selectedRoles = this.form.get('rolesSelectedOnForm')?.value;
          this.selectedRoleString = this.selectedRoles.map(role => role.name) as string[];
          console.log();
            this. userAddOrEdit = new User(this.id,
                                    '',//Code
                                    this.form.get('firstName')?.value,//prenom
                                     this.form.get('lastName')?.value,//nom
                                      this.form.get('username')?.value,//nom d'utilisateur
                                       this.form.get('password')?.value,//mot de passe
                                        this.form.get('email')?.value,//email
                                        undefined,//identifiant caisse
                                         undefined,//date inscription
                                         this.selectedRoleString as string[],//role
                                           undefined) ;//jeton

          });
          console.log(this.userAddOrEdit);
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
        this.accountService.update(this.userAddOrEdit)
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
    
    private createUser(){
        this.accountService.register(this.userAddOrEdit)
        .subscribe({
            next :(x) => {
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
        // create or update user based on id param
        console.log(this.userAddOrEdit);
        return this.id
            ? this.updateUser()
            : this.createUser();
            
    }
}
