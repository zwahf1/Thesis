import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-measurements',
  templateUrl: 'measurements.html'
})
export class MeasurementsPage {

  constructor(public navCtrl: NavController) {
    this.zeit = new Date;
    console.log(new Date());
    console.log(new Date(2016, 3, 4));
    console.log(new Date(20160305));
    console.log(new Date(20160306));
    this.values1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.values2 = [[Date.UTC(2016, 3, 4), 1, 2], [Date.UTC(2016, 3, 5), 2, 4], [Date.UTC(2016, 3, 7), 3, 6], [Date.UTC(2016, 3, 8), 4, 8],
      [Date.UTC(2016, 3, 9), 5, 10], [Date.UTC(2016, 3, 11), 6, 9], [Date.UTC(2016, 3, 12), 7, 8], [Date.UTC(2016, 3, 14), 8, 9],
      [Date.UTC(2016, 3, 17), 9, 10], [Date.UTC(2016, 3, 18), 10, 11]];

    this.options1 = {
      chart: {
        type: 'columnrange'
      },

      title: {
        text: ''
      },

      xAxis: {
        //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        type: 'datetime'
      },

      yAxis: {
        title: {
          text: 'Blutdruck ( mmHg )'
        }
      },

      tooltip: {
        valueSuffix: 'mmHg'
      },

      plotOptions: {
        columnrange: {
          dataLabels: {
            enabled: true,
            formatter: function() {
              return this.y + 'mmHg';
            }
          }
        }
      },

      legend: {
        enabled: false
      },

      series: [{
        name: 'Blutdruck',
        data: this.values2,
      }]
    };
    this.options2 = {
      chart: {
        type: 'columnrange'
      },

      title: {
        text: ''
      },

      xAxis: {
        type: 'datetime'
      },

      yAxis: {
        title: {
    text: null
},
        labels:
        {
          enabled: false
        }
      },

      tooltip: {
        valueSuffix: 'mmHg'
      },

      plotOptions: {
        columnrange: {
          dataLabels: {
            enabled: true,
            formatter: function() {
              return this.y + 'mmHg';
            }
          }
        }
      },

      legend: {
        enabled: false
      },

      series: [{
        name: 'Blutdruck',
        data: this.values2,
      }]
    };
  }
  newValue() {
    this.values1 = [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10], [6, 9], [7, 8], [8, 9], [9, 10], [10, 11]];
    console.log(this.values1);
    this.options1 = {
      series: [{
        data: this.values1,
      }]
    }
  }
  zeit: any;
  values1: any;
  values2: any;
  options1: Object;
  options2: Object;
}
