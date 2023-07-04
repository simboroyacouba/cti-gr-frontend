import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User | null;
    public options: any = {
        Chart: {
          type: 'area',
          height: 700
        },
        title: {
          text: 'Evolution de la population'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
        series: [{
          name: 'Asia',
          data: [502, 635, 809, 947, 1402, 3634, 5268]
      }, {
          name: 'Europe',
          data: [163, 203, 276, 408, 547, 729, 628]
      }, {
          name: 'America',
          data: [18, 31, 54, 156, 339, 818, 1201]
      }]
    }
    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        this.accountService.getById(this.user!.id!)
        .subscribe((x) => {
            this.user = x;
        });
    }
    ngOnInit(): void {
        Highcharts.chart('container', this.options);
    }
}