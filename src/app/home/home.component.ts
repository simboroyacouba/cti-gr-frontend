import { Component, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { InvoiceService } from '@app/_services/invoice.service';
import { SessionService } from '@app/_services/session.service';
import * as Highcharts from 'highcharts';
import { Invoice } from '@app/_models/Invoice';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user!: User | null;
    month01!: number;//mois precedent
    month02!: number;//mois actuel
    invoicesMonth01: Invoice[] = [];//contient les factures du mois precedent
    invoicesMonth02: Invoice[] = [];//contient les factures du mois actuel
    valuesMonth01: Values = new Values;
    valuesMonth02: Values = new Values;
    loading = true;
    public options: any ;
    constructor(
        private accountService: AccountService,
        private sessionService: SessionService,
        private invoiceService: InvoiceService,
        private location: Location,
        ) {
        
    }
    ngOnInit(): void {
        this.user = this.accountService.userValue;
        this.accountService.getById(this.user!.id!)
        .subscribe((x) => {
            this.user = x;
        }); 
        this.getData();
    }

    getData(){
        let date = new Date()
        this.month02 = date.getMonth()+1;
        this.month01 = this.month02 -1;
        this.invoiceService.getbetweenDate(new Date(date.getFullYear(), this.month01-1, 1),date)//recuperer les facturations de la session
        .subscribe((y:Invoice[]) => {
            let a =0;
            for(let invoice of y){
                if(new Date(invoice.date!).getMonth()+1 == this.month01){
                    if(new Date(invoice.date!).getDate() <= 5 && new Date(invoice.date!).getDate() > 0){
                        this.valuesMonth01.value1 = this.valuesMonth01.value1! +invoice.montantAPayer!;
                    }
                    else if(new Date(invoice.date!).getDate() <= 10 && new Date(invoice.date!).getDate() > 5){
                        this.valuesMonth01.value2 = this.valuesMonth01.value2! +invoice.montantAPayer!;
                    }
                    else if(new Date(invoice.date!).getDate() <= 15 && new Date(invoice.date!).getDate() > 10){
                        this.valuesMonth01.value3 = this.valuesMonth01.value3! +invoice.montantAPayer!; 
                    }
                    else if(new Date(invoice.date!).getDate() <= 20 && new Date(invoice.date!).getDate() > 15){
                        this.valuesMonth01.value4 = this.valuesMonth01.value4! +invoice.montantAPayer!;
                    }
                    else if(new Date(invoice.date!).getDate() <= 25 && new Date(invoice.date!).getDate() > 20){
                        this.valuesMonth01.value5 = this.valuesMonth01.value5! +invoice.montantAPayer!;
                    }
                    else{
                        this.valuesMonth01.value6 = this.valuesMonth01.value6! +invoice.montantAPayer!;
                    }
                }
                
                else if(new Date(invoice.date!).getMonth()+1 == this.month02){
                //console.log(this.month02);
                //console.log(new Date(invoice.date!).getDate());
                //console.log(invoice.code);
                    if(new Date(invoice.date!).getDate() <= 5 && new Date(invoice.date!).getDate() > 0){
                        this.valuesMonth02.value1 = this.valuesMonth02.value1! +invoice.montantAPayer!;
                    }
                    else if(new Date(invoice.date!).getDate() <= 10 && new Date(invoice.date!).getDate() > 5){
                        this.valuesMonth02.value2 = this.valuesMonth02.value2! +invoice.montantAPayer!;
                    }
                    else if(new Date(invoice.date!).getDate() <= 15 && new Date(invoice.date!).getDate() > 10){
                        this.valuesMonth02.value3 = this.valuesMonth02.value3! +invoice.montantAPayer!; 
                    }
                    else if(new Date(invoice.date!).getDate() <= 20 && new Date(invoice.date!).getDate() > 15){
                        this.valuesMonth02.value4 = this.valuesMonth02.value4! +invoice.montantAPayer!;
                    }
                    else if(new Date(invoice.date!).getDate() <= 25 && new Date(invoice.date!).getDate() > 20){
                        this.valuesMonth02.value5 = this.valuesMonth02.value5! +invoice.montantAPayer!;
                    }
                    else{
                        this.valuesMonth02.value6 = this.valuesMonth02.value6! +invoice.montantAPayer!;
                    }
                }
            }

            this.options = {
                Chart: {
                  type: 'area',
                  height: 700
                },
                title: {
                  text: 'Evolution des ventes'
                },
                credits: {
                  enabled: false
                },
                xAxis: {
                  categories: ['1', '5', '10', '15', '20', '25', '30'],
                  tickmarkPlacement: 'on',
                  title: {
                      enabled: false
                  }
              },
                series: [
                    {
                        name: 'mois passé',
                        data: [
                            0,
                            this.valuesMonth01.value1, 
                            this.valuesMonth01.value1 + this.valuesMonth01.value2, 
                            this.valuesMonth01.value1 + this.valuesMonth01.value2 + this.valuesMonth01.value3, 
                            this.valuesMonth01.value1 + this.valuesMonth01.value2 + this.valuesMonth01.value3 + this.valuesMonth01.value4, 
                            this.valuesMonth01.value1 + this.valuesMonth01.value2 + this.valuesMonth01.value3 + this.valuesMonth01.value4 + this.valuesMonth01.value5, 
                            this.valuesMonth01.value1 + this.valuesMonth01.value2 + this.valuesMonth01.value3 + this.valuesMonth01.value4 + this.valuesMonth01.value5 + this.valuesMonth01.value6
                        ]
                    }, 
                    {
                        name: 'Ce mois',
                        data: [
                            0,
                            this.valuesMonth02.value1, 
                            this.valuesMonth02.value1 + this.valuesMonth02.value2, 
                            this.valuesMonth02.value1 + this.valuesMonth02.value2 + this.valuesMonth02.value3, 
                            this.valuesMonth02.value1 + this.valuesMonth02.value2 + this.valuesMonth02.value3 + this.valuesMonth02.value4, 
                            this.valuesMonth02.value1 + this.valuesMonth02.value2 + this.valuesMonth02.value3 + this.valuesMonth02.value4 + this.valuesMonth02.value5, 
                            this.valuesMonth02.value1 + this.valuesMonth02.value2 + this.valuesMonth02.value3 + this.valuesMonth02.value4 + this.valuesMonth02.value5 + this.valuesMonth02.value6
                        ]
                    },
                    /*
                    {
                        name: 'America',
                        data: [18, 31, 54, 156, 339, 818, 1201]
                    }
                    */
                ]
            };
            this.loading = false;
            setTimeout(() => {
                Highcharts.chart('container', this.options);
              }, 2000)
        });
    
     }
}

export class Values{
    value1:number = 0;
    value2:number = 0;
    value3:number = 0;
    value4:number = 0;
    value5:number = 0;
    value6:number = 0;
    value7:number = 0;
}