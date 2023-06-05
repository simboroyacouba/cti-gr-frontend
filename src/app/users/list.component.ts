import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AccountService } from '@app/_services';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({ 
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss'],
})

export class ListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    users?: any[];
    pageEvent!: PageEvent;
    pgIndex!:number;
    pageSize = 5;
    length?:number;
    dataSource!: MatTableDataSource<any>
    columnsToDisplay = ['code', 'lastName', 'firstName'];
    totalRecords = 0;


    constructor(
        
        private accountService: AccountService,
        ) {}

       

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
            this.pageChange();
    }

            
     
     
      pageChange(event?:PageEvent){
        this.dataSource = new MatTableDataSource(this.users);
        this.length = this.users?.length as number;
        console.log(this.users);
        console.log('datasource'+this.dataSource);
        this.pgIndex = event?.pageIndex as number;
        
        console.log('pg index :'+this.pgIndex);
        //this.paginator.lastPage 
      }
    
    
    activateDesactivateUser(id: BigInt) {
        this.dataSource = new MatTableDataSource(this.users);
        this.length = this.users?.length as number;
        const userSelectedOnList = this.users!.find(x => x.id === id);
        userSelectedOnList.isDeleting = true;
        userSelectedOnList.password = '';
        this.accountService.activateDesactivate(userSelectedOnList)
            .pipe(first())
            .subscribe(() => this.users = this.users!.filter(x => x.id !== id));
            location.reload();
            
       
    }
}