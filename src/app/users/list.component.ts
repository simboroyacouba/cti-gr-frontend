import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AccountService } from '@app/_services';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { User } from '@app/_models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({ 
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss'],
})

export class ListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    desactivating = false;
    searchForm!: FormGroup;
    textRecherche!: string;
    usersGlobal!: any[];
    users?: any[];
    pageEvent!: PageEvent;
    pgIndex!:number;
    pageSize = 5;
    length?:number;
    dataSource!: MatTableDataSource<any>
    columnsToDisplay = ['code', 'lastName', 'firstName'];
    totalRecords = 0;


    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
    ) {}

       

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => {
                this.users = users;
                this.usersGlobal = users;
            });
            this.pageChange();
            this.searchForm = this.formBuilder.group({
                textRecherche: ['',],
            })
            this.recherche();
    }

            
    recherche(): void {
        setTimeout(() => {
          this.searchForm.valueChanges.subscribe(val => {
            this.textRecherche = this.searchForm.get('textRecherche')?.value;
           
            if(this.textRecherche != undefined || this.textRecherche !=''){
              this.users = [];
              for(let i = 0; i < this.usersGlobal.length; i++){
                if(this.usersGlobal[i].firstName!.indexOf(this.textRecherche)!== -1 || this.usersGlobal![i].lastName!.indexOf(this.textRecherche)!== -1 || this.usersGlobal![i].username!.indexOf(this.textRecherche)!== -1 || this.usersGlobal![i].code!.indexOf(this.textRecherche)!== -1){
                  this.users.push(this.usersGlobal![i]);
                }
              }
            }
          });
        }, 1500);
      }
     
      pageChange(event?:PageEvent){
        this.dataSource = new MatTableDataSource(this.users);
        this.length = this.users?.length as number;
        this.pgIndex = event?.pageIndex as number;
        
        //this.paginator.lastPage 
      }
    
    
    activateDesactivateUser(id: BigInt) {
        let use = new User();
        this.desactivating = true;
        use.id = id;
        this.accountService.activateDesactivate(use).subscribe({
            next: (value) => {
                this.desactivating = false;
                this.desactivating = false;
            },
            error: (error: any) => { }
        });
            
       
    }
}