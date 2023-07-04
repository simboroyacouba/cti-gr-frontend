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

@Component({ templateUrl: 'add-edit-articleType.component.html' ,
              styleUrls: ['list-article.component.scss'],})
export class AddEditArticleTypeComponent implements OnInit {
    form!: FormGroup;
    id?: BigInt;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    nomArticleTypeAddOrEdit!:string;
    articleTypeAddOrEdit = new ArticleType;
    userConnected!: User | null;
    dropdownSettings:IDropdownSettings={};


   
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
        
          //dans le cas ou il s'agit de modifier un user on recupere l'id a partir de l'url
        this.id = this.route.snapshot.params['id'];
        if(this.id !=null){
          this.articleTypeAddOrEdit.id = this.id;
        }
        // form with validation rules
        this.form = this.formBuilder.group({
            code: ['',],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            actif: [, Validators.required],

        });
        this.onChanges();
       
        this.title = "Ajouter un type d'article";
        if (this.id) {
          // edit mode

          this.title = "Modifier le type article";
          this.loading = true;
          this.articleService.getOneTypeArticleById(this.id)
              .subscribe((x:ArticleType) => {
                this.nomArticleTypeAddOrEdit = x.nom!;
                  this.articleTypeAddOrEdit = x;
                  this.form.patchValue(x);
                  this.loading = false;
                });
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
                                    this.articleTypeAddOrEdit.nom =  this.form.get('nom')?.value;//nom 
                                    this.articleTypeAddOrEdit.description = this.form.get('description')?.value;//description
                                    this.articleTypeAddOrEdit.actif =  this.form.get('actif')?.value;//actif
                                        

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

    private updateArticleType(){
                console.log(this.articleTypeAddOrEdit);
        this.articleService.updateTypeArticle(this.articleTypeAddOrEdit)
        .subscribe({
            next: (x) => {
            this.alertService.success("Type d'article enregistré", { keepAfterRouteChange: true });
            this.router.navigateByUrl('/articles/articleType');
        },
        error: error => {
            this.alertService.error(error);
        }
    });
    }
    
    private createArticleType(){
        this.articleService.registerTypeArticle(this.articleTypeAddOrEdit)
        .subscribe({
            next :(x) => {
            this.alertService.success("Type d'article enregistré", { keepAfterRouteChange: true });
            this.router.navigateByUrl('/articles/articleType');
        }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }

    private saveArticle() {
        // create or update user based on id param
        return this.id
            ? this.updateArticleType()
            : this.createArticleType();
            
    }
}
