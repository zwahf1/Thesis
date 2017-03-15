import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Chart } from '../../util/Chart';

@Component({
  selector: 'page-measurements',
  templateUrl: 'measurements.html'
})
export class MeasurementsPage {

  chartGluco: any;
  chartBP: any;
  chartPulse: any;
  chartWeight: any;

  constructor(public navCtrl: NavController) {
    var valuesGlucose = [[Date.UTC(2016, 3, 4), 2], [Date.UTC(2016, 3, 5), 4], [Date.UTC(2016, 3, 7), 6], [Date.UTC(2016, 3, 8), 8],
      [Date.UTC(2016, 3, 9), 10], [Date.UTC(2016, 3, 11), 9], [Date.UTC(2016, 3, 12), 8], [Date.UTC(2016, 3, 14), 9],
      [Date.UTC(2016, 3, 17), 10], [Date.UTC(2016, 3, 18), 11]];

    var valuesBP = [[Date.UTC(2016, 3, 4), 1, 2], [Date.UTC(2016, 3, 5), 2, 4], [Date.UTC(2016, 3, 7), 3, 6], [Date.UTC(2016, 3, 8), 4, 8],
      [Date.UTC(2016, 3, 9), 5, 10], [Date.UTC(2016, 3, 11), 6, 9], [Date.UTC(2016, 3, 12), 7, 8], [Date.UTC(2016, 3, 14), 8, 9],
      [Date.UTC(2016, 3, 17), 9, 10], [Date.UTC(2016, 3, 18), 10, 11]];

    var valuesPulse = [[Date.UTC(2016, 3, 4), 66], [Date.UTC(2016, 3, 5), 77], [Date.UTC(2016, 3, 7), 65], [Date.UTC(2016, 3, 8), 61],
      [Date.UTC(2016, 3, 9), 62], [Date.UTC(2016, 3, 11), 75], [Date.UTC(2016, 3, 12), 83], [Date.UTC(2016, 3, 14), 59],
      [Date.UTC(2016, 3, 17), 65], [Date.UTC(2016, 3, 18), 73]];

      var valuesWeight = [[Date.UTC(2016, 3, 4), 76.5], [Date.UTC(2016, 3, 5), 77.6], [Date.UTC(2016, 3, 7), 75.0], [Date.UTC(2016, 3, 8), 76.3],
        [Date.UTC(2016, 3, 9), 76.7], [Date.UTC(2016, 3, 11), 77.5], [Date.UTC(2016, 3, 12), 77.8], [Date.UTC(2016, 3, 14), 78.1],
        [Date.UTC(2016, 3, 17), 74.9], [Date.UTC(2016, 3, 18), 75.7]];

    this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', valuesGlucose);
    this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', valuesBP);
    this.chartPulse = new Chart('spline', 'Puls', 'pro Min', valuesPulse);
    this.chartWeight = new Chart('spline', 'Gewicht', 'kg', valuesWeight);

    /*
      this.chartBP = {
        chart: {
          type: 'columnrange',
          height: 300,
        },
        rangeSelector: {
          selected: 2,
          enabled: false,
        },
        yAxis: {
          title: {
            text: 'mmHg'
          },
          min: 0,
          opposite: false
        },
        navigator: {
          enabled: false
        },
        scrollbar: {
          enabled: true,
          liveRedraw: false
        },
        title: {
          text: '',
        },
        tooltip: {
          valueSuffix: 'mmHg',
          followTouchMove: false,
          followPointer: false

        },
        series: [{
          name: 'Blutdruck',
          data: valuesBP,
        }]
      }
  */
  }
  /*
  newValue() {
    this.valuesBP = [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10], [6, 9], [7, 8], [8, 9], [9, 10], [10, 11]];
    this.chartBP1 = {
      series: [{
        data: this.valuesBP,
      }]
    }
  }
*/
  /*
    createGlucoseChart(type: string, marginLeft: any, title: string, suffix: string, data: any) {
      this.chartGluco1 = {
        chart: {
          type: type,
          marginLeft: marginLeft,
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: title+'('+ suffix+')'
          }
        },
        tooltip: {
          valueSuffix: suffix
        },
        plotOptions: {
          columnrange: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y + suffix;
              }
            }
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: '',
          data: data,
        }]
      };
      this.chartGluco2 = {
        chart: {
          type: type
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
          valueSuffix: suffix
        },
        plotOptions: {
          spline: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.y + suffix;
              }
            }
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: title,
          data: data,
          lineWidth: 0,
          states: {
            hover: {
              //lineWidthPlus: 0
            }
          }
        }]
      };
    }
    */

}
