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

@Component({ templateUrl: 'add-edit-article.component.html' ,
              styleUrls: ['list-article.component.scss'],})
export class AddEditArticleComponent implements OnInit {
    form!: FormGroup;
    id?: BigInt;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    articleAddOrEdit = new Article;
    changerPhoto = false;
    userConnected!: User | null;
    dropdownSettings:IDropdownSettings={};
    nomImage!: string;

    articleTypes!: ArticleType[];

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
    ) {}

    ngOnInit() {
        
   // this.imageInfos = this.accountService.getFiles();
   
       
        this.userConnected = this.accountService.userValue;
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });
        this.articleService.getAllTypeArticle()
        .subscribe((x) => {
            this.articleTypes = x;
        });
        
          //dans le cas ou il s'agit de modifier un user on recupere l'id a partir de l'url
        this.id = this.route.snapshot.params['id'];
        if(this.id !=null){
          this.articleAddOrEdit.id = this.id;
        }
        // form with validation rules
        this.form = this.formBuilder.group({
          code: ['',],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            codeBar: ['', ],
            prixVente: [, Validators.required],
            prixAchat: [, ],
            idTypeArticle: [, Validators.required],
            stock: [, Validators.required],
            stockMin: [, Validators.required],
            achat: [, Validators.required],
            actif: [, Validators.required],

        });
        this.onChanges();
       
        this.title = 'Ajouter un  article';
        if (this.id) {
          // edit mode

          this.title = "Modifier l'article";
          this.loading = true;
          this.articleService.getById(this.id)
              .subscribe((x) => {
                  this.form.patchValue(x);
                  console.log(x);
                  this.articleAddOrEdit.achat = x.achat;
                  this.photo = `${environment.apiUrl}/api/auth/download?chemin=`+x.photo?.replace(/\\/g, '/');
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

test(){
  console.log('***********************');
  console.log(this.articleAddOrEdit);
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
            this.articleAddOrEdit = new Article(this.id,//id
                                    undefined,//date enregistrement
                                    undefined,//code
                                     this.form.get('codeBar')?.value,//codebar
                                      this.form.get('nom')?.value,//nom 
                                       this.form.get('description')?.value,//description
                                        this.form.get('prixVente')?.value,//prix vente
                                        this.form.get('prixAchat')?.value,//prix achat
                                        this.form.get('idTypeArticle')?.value,//id type article
                                         this.form.get('actif')?.value,//actif
                                         this.form.get('achat')?.value,//achat
                                         this.form.get('photo')?.value,//photo
                                         this.form.get('stock')?.value ,//stock
                                         this.form.get('stockMin')?.value ,) ;//stock min

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
        this.saveArticle()
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

    private updateArticle(){
        this.articleService.update(this.articleAddOrEdit)
        .subscribe({
            next: (x) => {
            this.uploadImage('PRO'+x.message);
            this.alertService.success('Article enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/articles');
        },
        error: error => {
            this.alertService.error(error);
        }
    });
    }
    
    private createArticle(){
        this.articleService.register(this.articleAddOrEdit)
        .subscribe({
            next :(x) => {
            this.uploadImage('PRO'+x.message);
            this.alertService.success('Article enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/articles');
        }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }

    private saveArticle() {
        // create or update user based on id param
        console.log(this.articleAddOrEdit);
        return this.id
            ? this.updateArticle()
            : this.createArticle();
            
    }
}
