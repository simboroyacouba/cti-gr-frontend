import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { AccountService, AlertService } from '@app/_services';
import {User} from '@app/_models/user';
import { Pos } from '@app/_models/pos';
import { PosService } from '@app/_services/pos.service';
import { Role } from '@app/_models/role';

@Component({ templateUrl: 'add-edit-pos.component.html' ,
              styleUrls: ['list-pos.component.scss'],})
export class AddEditPosComponent implements OnInit {
    form!: FormGroup;
    form2!: FormGroup;
    id?: BigInt;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    loadingForm2 = false;
    submitting2 = false;
    submitted2 = false;
    posAddOrEdit = new Pos;
    userConnected!: User | null;
    dropdownSettings:IDropdownSettings={};
    idUserAwaitAddingToBox!: BigInt;
    caissiers!: User[];
    caissiersOnPos!: User[];
    isDeleting = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private posService: PosService,
        private alertService: AlertService,
    ) {}

    ngOnInit() {
 
        this.userConnected = this.accountService.userValue;  
        this.accountService.getById(this.userConnected!.id!)
        .subscribe((x) => {
            this.userConnected = x;
        });
        
        this.caissiers = [];
        this.caissiersOnPos = [];
            this.accountService.getAll()
            .subscribe((x) => {
                for(let i=0; i<x.length; i++){
                    let listRole!: Role[];
                    listRole = [];
                    listRole = x[i].roles as Role[];
                    if(x[i].idBox == null){
                        for(let a=0; a<listRole.length; a++){
                            if(listRole[a].name == "ROLE_CAISSIER"){
                                this.caissiers.push(x[i]);
                            }
                        }
                    }
                    
                    
                    if(x[i].idBox == this.id){
                        this.caissiersOnPos.push(x[i]);
                    }
                }
            });
        
          //dans le cas ou il s'agit de modifier un user on recupere l'id a partir de l'url
        this.id = this.route.snapshot.params['id'];
        if(this.id !=null){
          this.posAddOrEdit.id = this.id;
        }
        // form with validation rules
        this.form = this.formBuilder.group({
          code: ['',],
            nom: ['', Validators.required],
            actif: [, Validators.required],

        });
        this.onChanges();

        this.form2 = this.formBuilder.group({
              idUser: ['', Validators.required],
  
          });
          this.onChangesAddUserToBox();
       
        this.title = 'Ajouter un  point de vente';
        if (this.id) {
          // edit mode

          this.title = "Modifier le point de vente";
          this.loading = true;
          this.posService.getById(this.id)
              .subscribe((x) => {
                  this.form.patchValue(x);
                  this.posAddOrEdit.code = x.code;
                  this.posAddOrEdit.actif = x.actif;
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
            this.posAddOrEdit = new Pos(this.id,//id
                                    undefined,
                                      this.form.get('nom')?.value,//nom 
                                         this.form.get('actif')?.value,//actif
                                         );

          });
    }

    onChangesAddUserToBox(): void {
        this.form.valueChanges.subscribe(val => {
                this.idUserAwaitAddingToBox = this.form.get('idUser')?.value;//nom 
        });
    }
    

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    get f2() { return this.form2.controls; }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.savePos()
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

    private updatePos(){
        this.posService.update(this.posAddOrEdit)
        .subscribe({
            next: (x) => {
            this.alertService.success('point de vente enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/pos');
        },
        error: error => {
            this.alertService.error(error);
        }
    });
    }
    
    private createPos(){
        this.posService.register(this.posAddOrEdit)
        .subscribe({
            next :(x) => {
            this.alertService.success('point de vente enregistré', { keepAfterRouteChange: true });
            this.router.navigateByUrl('/pos');
        }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }

    private savePos() {
        // create or update user based on id param
        return this.id
            ? this.updatePos()
            : this.createPos();
            
    }

    onSubmitAddUserToBox(){
        this.submitted2 = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting2 = true;
        console.log(this.form2.get('idUser')?.value+"*****"+this.id);
        this.posService.addUserToBox(this.form2.get('idUser')?.value, this.id!)
        .subscribe({
            next :(x) => {
                this.alertService.success('point de vente enregistré');
                this.ngOnInit();
            }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }

    removeUserOnBox(id: BigInt){
        this.posService.removeUserToBox(id)//Jeton
        .subscribe({
            next :(x) => {
                this.alertService.success('Caissier retiré du point de vente', { keepAfterRouteChange: true });
                this.ngOnInit();
            }, 
            error: error => {
                this.alertService.error(error);
            }
        });
    }
}
