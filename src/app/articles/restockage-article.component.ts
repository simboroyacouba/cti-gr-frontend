import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { DialogInfo } from '@app/_components/dialogInfo/DialogInfo';
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
import { Approvisionnement } from '@app/_models/approvisionnement';
import { MatDialog } from '@angular/material/dialog';


@Component({ templateUrl: 'restockage-article.component.html' ,
              styleUrls: ['list-article.component.scss'],})
export class RestockageArticleComponent implements OnInit {
    form!: FormGroup;
    id?: BigInt;
    loading = false;
    submitting = false;
    submitted = false;
    articles!: Article[];
    approvisionnement: Approvisionnement = new Approvisionnement;
    articleUpdateStock = new Article;
    userConnected!: User | null;

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
        
        this.userConnected = this.accountService.userValue;
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });

        this.articleService.getAll()
        .subscribe((x) => {
            this.articles = x;
        });
        
          //dans le cas ou il s'agit de modifier un user on recupere l'id a partir de l'url
        this.id = this.route.snapshot.params['id'];
        if(this.id !=null){
          this.articleUpdateStock.id = this.id;
          this.articleService.getById(this.articleUpdateStock.id)
            .subscribe((x) => {
                this.articleUpdateStock = x;
            });
        }
        // form with validation rules
        this.form = this.formBuilder.group({
            ravitaillement: [, Validators.required],
            quantite: ['', Validators.required],
            motif: [, Validators.required],
            montantTotal: [, ],
            description: [,]

        });
        this.onChanges();
       
       
    }
   
    onChanges(): void {
        this.form.valueChanges.subscribe(val => {
          this.articleUpdateStock.stock = this.form.get('stock')?.value;//stock

          this.approvisionnement.idEmploye = this.userConnected!.id;
          this.approvisionnement.montantTotal = this.form.get('montantTotal')?.value;

          if( this.form.get('quantite')?.value > 0){
            this.approvisionnement.quantite = this.form.get('quantite')?.value;
          }
          else if(this.form.get('quantite')?.value < 0){
            const dialogRef = this.dialog.open(DialogInfo, {
                data: {name: "Veuillez enrer une valeur positive"},
            });
          }
          this.approvisionnement.motif = this.form.get('motif')?.value;
          this.approvisionnement.description = this.form.get('description')?.value;
          this.approvisionnement.idFournisseur  = undefined;
          this.approvisionnement.ravitaillement = this.form.get('ravitaillement')?.value;
          
          console.log("in form : "+this.form.get('ravitaillement')?.value);
          console.log("in variable : "+this.approvisionnement.ravitaillement);

          this.approvisionnement.idArticle = this.articleUpdateStock.id;
          });
  
        }
    test(){
       
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
           
        this.articleService.restocker(this.approvisionnement)
        .subscribe({
            next: (x) => {
            this.alertService.success('Article enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/articles');
        },
        error: error => {
            this.alertService.error(error);
        }
    });
        this.submitting = false;
    }
}
