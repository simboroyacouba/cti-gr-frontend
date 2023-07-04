import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import {MatButtonModule} from '@angular/material/button';
import { AccountService, AlertService } from '@app/_services';
import {User} from '@app/_models/user';
import { Role } from '@app/_models/role';
import { Observable } from 'rxjs/internal/Observable';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ArticleService } from '@app/_services/article.service';
import { Article } from '@app/_models/Article';
import { ArticleType } from '@app/_models/ArticleType';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfo } from '@app/_components/dialogInfo/DialogInfo';
import { Entreprise } from '@app/_models/Entreprise';

@Component({ templateUrl: 'entrepriseComponent.html' ,
              styleUrls: ['entreprise.component.scss'],})
export class EntrepriseComponent implements OnInit {
    form!: FormGroup;
    id?: BigInt;
    loading = false;
    submitting = false;
    submitted = false;
    entreprise = new Entreprise;
    changerPhoto = false;
    userConnected!: User | null;
    nomImage!: string;

    photo!:string;

    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';

    // Handle the toggle change event
   
    imageInfos?: Observable<any>;
   
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private articleService: ArticleService,
        private alertService: AlertService,
        public dialog: MatDialog,
    ) {}

    ngOnInit() {
        
   // this.imageInfos = this.accountService.getFiles();
   
       
        this.userConnected = this.accountService.userValue;
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });
        this.accountService.getEntreprise()
        .subscribe((x) => {
            this.entreprise = x;
        });
        
        // form with validation rules
        this.form = this.formBuilder.group({
            nom: ['', Validators.required],
            sigle: [, Validators.required],
            pays: ['', ],
            ville: [,Validators.required],
            texte1: ['', Validators.required],//contact
            texte2: ['', ],//capital
            texte3: ['', ],//email
            texte4: ['', Validators.required],//texteRemerciement
            rccm: ['', ],
            ifu: ['', ],
            monnaie: ['', ],
            description: [,],
            formeJuridique: ['',],

        });
        this.onChanges();
       
        
          // edit mode

          this.loading = true;
          this.accountService.getEntreprise()
              .subscribe((x) => {
                  this.form.patchValue(x);
                  this.photo = `${environment.apiUrl}/api/auth/download?chemin=`+x.image?.replace(/\\/g, '/');
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
      this.changerPhoto = true;
        this.message = '';
        this.preview = '';
        this.progress = 0;
        this.selectedFiles = event.target.files;
    
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

      problem(message: string){
        const dialogRef = this.dialog.open(DialogInfo, {
          data: {name: message},
      });
      }
      uploadImage(): void {
        this.progress = 0;
    
    
        if (this.selectedFiles) {
          let file: File | null = this.selectedFiles.item(0);
          
          const fileExtension = file?.name.split('.').pop();
          file = new File([file as File], "entre"+"."+fileExtension, { type: file?.type });
          if (file) {
            this.currentFile = file;
            this.accountService.uploadProfilePhotoentreprise(this.currentFile,).subscribe({
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
          this.entreprise.nom = this.form.get('nom')?.value;//nom
          this.entreprise.sigle = this.form.get('sigle')?.value;//Sigle


          this.entreprise.pays = this.form.get('pays')?.value;//pays
          this.entreprise.ville = this.form.get('ville')?.value;//ville
          this.entreprise.texte1 = this.form.get('texte1')?.value;//contact
          this.entreprise.texte2 = this.form.get('texte2')?.value;//capital
          this.entreprise.texte2 = this.form.get('texte3')?.value;//email
          this.entreprise.texte4 = this.form.get('texte4')?.value;//texteRemerciement
          this.entreprise.rccm = this.form.get('rccm')?.value;//rccm
          this.entreprise.ifu = this.form.get('ifu')?.value;//ifu
          this.entreprise.monnaie = this.form.get('monnaie')?.value;//monnaie
          this.entreprise.description = this.form.get('description')?.value;//description (nombre de ticket de caisse)
          
          this.entreprise.formeJuridique = this.form.get('formeJuridique')?.value;//formeJuridique
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
        this.updateEntreprise();
        this.submitting = false;
    }

    private updateEntreprise(){
        this.accountService.updateentreprise(this.entreprise)
        .subscribe({
            next: (x) => {
            this.uploadImage();
            this.alertService.success('Article enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/');
        },
        error: error => {
            this.alertService.error(error);
            this.problem(error);
        }
    });
    }
}
