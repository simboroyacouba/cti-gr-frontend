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
import { Depacketage } from '@app/_models/depacketage';
import { MatDialog } from '@angular/material/dialog';

@Component({ templateUrl: 'depackage-article.component.html' ,
              styleUrls: ['list-article.component.scss'],})
export class DepackageArticleComponent implements OnInit {
    form!: FormGroup;
    id!: BigInt;
    articleADepacker!: Article;
    depacketage: Depacketage = new Depacketage;
    articles!: Article[];
    loading = false;
    submitting = false;
    submitted = false;
    userConnected!: User | null;

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
       //recuperer l'id a partir de l'url
        this.id = this.route.snapshot.params['id'];
        //recuperer les infos concernant l'article a dépacker
        this.articleService.getById(this.id)
        .subscribe((x) => {
            this.articleADepacker = x;
        });
   
       //recuperer l'utilisateur connecté
        this.userConnected = this.accountService.userValue;
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });
       
        
        

        // form with validation rules
        this.form = this.formBuilder.group({
          idArticleAjout: ['',Validators.required],
          quantiteArticleDimunition: ['', Validators.required],
          quantiteArticleAjout: ['',Validators.required],
          motif: ['', Validators.required]

        });
        //recuperer la liste des articles
        this.articleService.getAll()
        .subscribe((x: Article[]) => {
          this.articles = [];
          for(let i = 0; i < x.length; i++){
            if(x[i].achat == true){
              if(x[i].id != this.articleADepacker.id){
              this.articles.push(x[i]);
              }
            }
          }
        });
        this.onChanges();
       
       
        
    }

    onChanges(): void {
        this.form.valueChanges.subscribe(val => {
          
          this.depacketage.idArticleDimunition = this.id,//id
          this.depacketage.idArticleAjout = this.form.get('idArticleAjout')?.value;
          this.depacketage.quantiteArticleDimunition = this.form.get('quantiteArticleDimunition')?.value;
          this.depacketage.quantiteArticleAjout = this.form.get('quantiteArticleAjout')?.value;
          this.depacketage.motif = this.form.get('motif')?.value;
          this.depacketage.idEmploye = this.userConnected?.id;
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
        this.articleService.depaquetage(this.depacketage)
        .subscribe((x) => {
          this.alertService.success('Article enregistré', { keepAfterRouteChange: true });
          this.router.navigateByUrl('/articles');
        });
        
        this.submitting = false;
    }

      getCodeArticleById(id:BigInt): string{
        let code = '';
        for(let i = 0; i < this.articles.length; i++){
          if(this.articles[i].id == id){
            code = this.articles[i].code!;
          }
        }
        return code;
      }
}
