import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Chart } from '../../util/Chart';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-measurements',
  templateUrl: 'measurements.html'
})
export class MeasurementsPage {

  chartAll: any;
  chartGluco: any;
  chartGlucoVisible: any;
  chartBP: any;
  chartPulse: any;
  chartWeight: any;
  /**************************************************
                    constructor

  create the medication page with parameters
    - nacCtrl: navigation controller to navigate between pages
    - storage: local storage

  storage SET:
    -glucoseValues: the measurements of the blood glucose
    -bpValues: the measurements of the blood pressure
    -pulseValues: the measurements of the pulse
    -weightValues: the measurements of the scale
**************************************************/
  constructor(public navCtrl: NavController, public storage: Storage) {
    /**************************************************
    sample data for glucose, blood pressure, pulse and weight
    **************************************************/
    var valuesGlucose = [[Date.UTC(2016, 3, 4), 2], [Date.UTC(2016, 3, 5), 4], [Date.UTC(2016, 3, 7), 6], [Date.UTC(2016, 3, 8), 8],
      [Date.UTC(2016, 3, 9), 10], [Date.UTC(2016, 3, 11), 9], [Date.UTC(2016, 3, 12), 8], [Date.UTC(2016, 3, 14), 9],
      [Date.UTC(2016, 3, 17), 10], [Date.UTC(2016, 3, 18), 11]];


    var valuesBP = [[Date.UTC(2016, 3, 4), 71, 132], [Date.UTC(2016, 3, 5), 62, 124], [Date.UTC(2016, 3, 7), 73, 126], [Date.UTC(2016, 3, 8), 54, 118],
      [Date.UTC(2016, 3, 9), 65, 110], [Date.UTC(2016, 3, 11), 66, 119], [Date.UTC(2016, 3, 12), 57, 128], [Date.UTC(2016, 3, 14), 68, 129],
      [Date.UTC(2016, 3, 17), 79, 130], [Date.UTC(2016, 3, 18), 60, 121]];

    var valuesPulse = [[Date.UTC(2016, 3, 4), 66], [Date.UTC(2016, 3, 5), 77], [Date.UTC(2016, 3, 7), 65], [Date.UTC(2016, 3, 8), 61],
      [Date.UTC(2016, 3, 9), 62], [Date.UTC(2016, 3, 11), 75], [Date.UTC(2016, 3, 12), 83], [Date.UTC(2016, 3, 14), 59],
      [Date.UTC(2016, 3, 17), 65], [Date.UTC(2016, 3, 18), 73]];

    var valuesWeight = [[Date.UTC(2016, 3, 4), 76.5], [Date.UTC(2016, 3, 5), 77.6], [Date.UTC(2016, 3, 7), 75.0], [Date.UTC(2016, 3, 8), 76.3],
      [Date.UTC(2016, 3, 9), 76.7], [Date.UTC(2016, 3, 11), 77.5], [Date.UTC(2016, 3, 12), 77.8], [Date.UTC(2016, 3, 14), 78.1],
      [Date.UTC(2016, 3, 17), 74.9], [Date.UTC(2016, 3, 18), 75.7]];

    //the sample data are stored in local storage

    this.storage.ready().then(() => {
      this.storage.set('glucoseValues', valuesGlucose);
      this.storage.set('bpValues', valuesBP);
      this.storage.set('pulseValues', valuesPulse);
      this.storage.set('weightValues', valuesWeight);
    });

    //the charts are created by the Chart-class

    this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', valuesGlucose);
    this.chartGlucoVisible = 'inline';
    this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', valuesBP);
    this.chartPulse = new Chart('spline', 'Puls', 'pro Min', valuesPulse);
    this.chartWeight = new Chart('spline', 'Gewicht', 'kg', valuesWeight);

    this.chartAll = {
      chart: {
        // Edit chart spacing
        spacingLeft: 0,
        spacingRight: 0,

        // Explicitly tell the width and height of a chart
        width: null,
        height: 300,
        zoomType: 'x',
            resetZoomButton: {
                position: {
                    verticalAlign: 'bottom', // by default
                    y: -35,
                },
                relativeTo: 'plot'
            },
      },
      title: {
        text: null
      }, xAxis: {
        type: 'datetime',
      }, yAxis: [{
        title: { text: 'Blutdruck, Puls und Gewicht' },
        min: 0,
        opposite: false,
      }, {
          title: { text: 'Blutzucker' },
          min: 0,
          opposite: true,

        }], series: [{
          type: 'spline',
          name: 'Blutzucker',
          yAxis: 1,
          data: valuesGlucose,
        }, {
            type: 'columnrange',
            name: 'Blutdruck',
            yAxis: 0,
            data: valuesBP,
          }, {
            type: 'spline',
            name: 'Puls',
            yAxis: 0,
            data: valuesPulse,
          }, {
            type: 'spline',
            name: 'Gewicht',
            yAxis: 0,
            data: valuesWeight
          }],
          //the legend isn't visible, so the user can't disable e serie of data
          legend: {
            enabled: true
          },
      navigator: {
        enabled: false
      },
      rangeSelector: {
        selected: 1,
        enabled: false,
      },
      scrollbar: {
        enabled: false,
        liveRedraw: false
      },
    }
  }
  expand(src) {
    console.log(src);
    console.log(src.parentNode.parentNode.parentNode.parentNode);
    console.log(src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0].getAttribute('style'));
    var element = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
    var mode = ''+src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0].getAttribute('style');
    console.log(mode.search('none'));

  if(mode.search('none')<0){
      console.log('visible');
      //this.chartGlucoVisible = 'none';
      element.style.display = 'none';
    }else if(mode.search('none')>0){
      console.log('none visible');
      //this.chartGlucoVisible = 'inline';
      element.style.display = 'inline';
    }

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

}
