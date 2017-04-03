import { Component } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
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
  chartBP: any;
  chartPulse: any;
  chartWeight: any;
  visibleList = [];
  vitalRangeList = [];
  glucoseUnit: string = 'mmol/L';
  /**************************************************
  sample data for glucose, blood pressure, pulse and weight
  **************************************************/
  valuesGlucose = [[Date.UTC(2016, 3, 4), 2], [Date.UTC(2016, 3, 5), 4], [Date.UTC(2016, 3, 7), 6], [Date.UTC(2016, 3, 8), 8],
    [Date.UTC(2016, 3, 9), 10], [Date.UTC(2016, 3, 11), 9], [Date.UTC(2016, 3, 12), 8], [Date.UTC(2016, 3, 14), 9],
    [Date.UTC(2016, 3, 17), 10], [Date.UTC(2016, 3, 18), 11]];


  valuesBP = [[Date.UTC(2016, 3, 4), 71, 132], [Date.UTC(2016, 3, 5), 62, 124], [Date.UTC(2016, 3, 7), 73, 126], [Date.UTC(2016, 3, 8), 54, 118],
    [Date.UTC(2016, 3, 9), 65, 110], [Date.UTC(2016, 3, 11), 66, 119], [Date.UTC(2016, 3, 12), 57, 128], [Date.UTC(2016, 3, 14), 68, 129],
    [Date.UTC(2016, 3, 17), 79, 130], [Date.UTC(2016, 3, 18), 60, 121]];

  valuesPulse = [[Date.UTC(2016, 3, 4), 66], [Date.UTC(2016, 3, 5), 77], [Date.UTC(2016, 3, 7), 65], [Date.UTC(2016, 3, 8), 61],
    [Date.UTC(2016, 3, 9), 62], [Date.UTC(2016, 3, 11), 75], [Date.UTC(2016, 3, 12), 83], [Date.UTC(2016, 3, 14), 59],
    [Date.UTC(2016, 3, 17), 65], [Date.UTC(2016, 3, 18), 73]];

  valuesWeight = [[Date.UTC(2016, 3, 4), 76.5], [Date.UTC(2016, 3, 5), 77.6], [Date.UTC(2016, 3, 7), 75.0], [Date.UTC(2016, 3, 8), 76.3],
    [Date.UTC(2016, 3, 9), 76.7], [Date.UTC(2016, 3, 11), 77.5], [Date.UTC(2016, 3, 12), 77.8], [Date.UTC(2016, 3, 14), 78.1],
    [Date.UTC(2016, 3, 17), 74.9], [Date.UTC(2016, 3, 18), 75.7]];

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

    //the sample data are stored in the device storage
    this.storage.ready().then(() => {
      this.storage.set('glucoseValues', this.valuesGlucose);
      this.storage.set('bpValues', this.valuesBP);
      this.storage.set('pulseValues', this.valuesPulse);
      this.storage.set('weightValues', this.valuesWeight);
    });

    this.vitalRangeList.push(new VitalRange('Glukose', 3.6, 7.7, 'mmol/L', new Date));
    this.vitalRangeList.push(new VitalRange('Diastolischer BD', 70, 89, 'mmHg', new Date));
    this.vitalRangeList.push(new VitalRange('Systolischer BD', 100, 139, 'mmHg', new Date));
    this.vitalRangeList.push(new VitalRange('Puls', 0, 0, '/min', new Date));
    this.vitalRangeList.push(new VitalRange('Gewicht', 75, 85, 'kg', new Date));

    this.storage.ready().then(() => {
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        }
      })
    });

    //the charts are created by the Chart-class
    this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', this.valuesGlucose, this.vitalRangeList[0].lowerLimit, this.vitalRangeList[0].upperLimit, 0, 0);
    this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', this.valuesBP, this.vitalRangeList[1].lowerLimit, this.vitalRangeList[1].upperLimit, this.vitalRangeList[2].lowerLimit, this.vitalRangeList[2].upperLimit);
    this.chartPulse = new Chart('spline', 'Puls', 'pro Min', this.valuesPulse, 0, 0, 0, 0);
    this.chartWeight = new Chart('spline', 'Gewicht', 'kg', this.valuesWeight, this.vitalRangeList[4].lowerLimit, this.vitalRangeList[4].upperLimit, 0, 0);
    this.createAllChart();
  }
  ionViewDidEnter() {
    console.log(this.chartGluco.series[0].data);
    this.storage.ready().then(() => {
      this.storage.get('VisibleList').then((val) => {
        if (val) {
          this.visibleList = val;
          this.hideCharts();
        }
      })
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        }
      })
    });
    this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', this.valuesGlucose, this.vitalRangeList[0].lowerLimit, this.vitalRangeList[0].upperLimit, 0, 0);
    this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', this.valuesBP, this.vitalRangeList[1].lowerLimit, this.vitalRangeList[1].upperLimit, this.vitalRangeList[2].lowerLimit, this.vitalRangeList[2].upperLimit);
    this.chartPulse = new Chart('spline', 'Puls', 'pro Min', this.valuesPulse, 0, 0, 0, 0);
    this.chartWeight = new Chart('spline', 'Gewicht', 'kg', this.valuesWeight, this.vitalRangeList[4].lowerLimit, this.vitalRangeList[4].upperLimit, 0, 0);
  }
  test() {
    this.valuesGlucose = [[Date.UTC(2016, 3, 4), 2], [Date.UTC(2016, 3, 5), 4], [Date.UTC(2016, 3, 7), 6], [Date.UTC(2016, 3, 8), 8],
      [Date.UTC(2016, 3, 9), 10], [Date.UTC(2016, 3, 11), 9], [Date.UTC(2016, 3, 12), 8], [Date.UTC(2016, 3, 14), 9],
      [Date.UTC(2016, 3, 17), 10], [Date.UTC(2016, 3, 18), 11], [Date.UTC(2016, 4, 2), 6.5]];
    //  this.chartGluco = new Chart('spline', 'Blutzucker', '' + 'mmol/L', this.valuesGlucose);
    console.log(this.chartGluco.series[0].data);
    this.chartGluco.series[0].data.push([Date.UTC(2016, 4, 2), 6.5]);
    console.log(this.chartGluco.series[0].data);
  }

  /*    newValue() {
        this.valuesBP = [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10], [6, 9], [7, 8], [8, 9], [9, 10], [10, 11]];
        this.chartBP1 = {
          series: [{
            data: this.valuesBP,
          }]
        }
      }
      */
  expand(src) {
    var element = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
    var mode = '' + src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0].getAttribute('style');

    if (mode.search('none') < 0) {
      //this.chartGlucoVisible = 'none';
      element.style.display = 'none';
    } else if (mode.search('none') > 0) {
      //this.chartGlucoVisible = 'inline';
      element.style.display = 'inline';
    }
  }

  hideCharts() {
    for (var key in this.visibleList) {
      var x = document.getElementById(key)
      if (this.visibleList[key]) {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  }
  createAllChart() {
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
          data: this.valuesGlucose,
        }, {
            type: 'columnrange',
            name: 'Blutdruck',
            yAxis: 0,
            data: this.valuesBP,
          }, {
            type: 'spline',
            name: 'Puls',
            yAxis: 0,
            data: this.valuesPulse,
          }, {
            type: 'spline',
            name: 'Gewicht',
            yAxis: 0,
            data: this.valuesWeight
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
  createGlucoseChart() {
    this.chartGluco = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: 'spline',
        //the height is fixed because of the rotation of the smartphone
        height: 300,
      },
      //credits are disabled, default is enabled
      credtis: {
        enabled: false,
      },
      //title isn't set, it's set directly in html with <h2>-tag
      title: {
        text: null,
      },
      //the lables in the x-axis are the dates of the measurements
      xAxis: {
        type: 'datetime'
      },
      //on the y-axis, the unit is shown and it starts on zero. with opposite = false,
      //the y-axis is on the right side
      yAxis: {
        title: {
          text: 'mmol/L',
        },
        min: 0,
        opposite: false,
      },
      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        valueSuffix: ' ' + 'mmol/L',
        followTouchMove: false,
        followPointer: false
      },
      //navigator, range selector and scrollbar aren't visible - reason of usability

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
      //the legend isn't visible, so the user can't disable e serie of data
      legend: {
        enabled: false
      },
      //the title of the serie is given from MeasurementsPage, also the data
      series: [{
        name: 'Blutzucker',
        data: this.valuesGlucose,
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 5,
        },
        //if a mark is selected, a thin line is visible
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }]
    };
  }
  createBPChart() {
    this.chartBP = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: 'columnrange',
        //the height is fixed because of the rotation of the smartphone
        height: 300,
      },
      //credits are disabled, default is enabled
      credtis: {
        enabled: false,
      },
      //title isn't set, it's set directly in html with <h2>-tag
      title: {
        text: null,
      },
      //the lables in the x-axis are the dates of the measurements
      xAxis: {
        type: 'datetime'
      },
      //on the y-axis, the unit is shown and it starts on zero. with opposite = false,
      //the y-axis is on the right side
      yAxis: {
        title: {
          text: 'mmHg',
        },
        min: 0,
        opposite: false,
      },
      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        valueSuffix: ' ',
        followTouchMove: false,
        followPointer: false
      },
      //navigator, range selector and scrollbar aren't visible - reason of usability

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
      //the legend isn't visible, so the user can't disable e serie of data
      legend: {
        enabled: false
      },
      //the title of the serie is given from MeasurementsPage, also the data
      series: [{
        name: 'Blutdruck',
        data: '',
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 5,
        },
        //if a mark is selected, a thin line is visible
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }]
    };
  }
  createPulseChart() {
    this.chartPulse = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: 'spline',
        //the height is fixed because of the rotation of the smartphone
        height: 300,
      },
      //credits are disabled, default is enabled
      credtis: {
        enabled: false,
      },
      //title isn't set, it's set directly in html with <h2>-tag
      title: {
        text: null,
      },
      //the lables in the x-axis are the dates of the measurements
      xAxis: {
        type: 'datetime'
      },
      //on the y-axis, the unit is shown and it starts on zero. with opposite = false,
      //the y-axis is on the right side
      yAxis: {
        title: {
          text: '/min',
        },
        min: 0,
        opposite: false,
      },
      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        valueSuffix: ' /min',
        followTouchMove: false,
        followPointer: false
      },
      //navigator, range selector and scrollbar aren't visible - reason of usability

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
      //the legend isn't visible, so the user can't disable e serie of data
      legend: {
        enabled: false
      },
      //the title of the serie is given from MeasurementsPage, also the data
      series: [{
        name: 'Puls',
        data: this.valuesPulse,
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 5,
        },
        //if a mark is selected, a thin line is visible
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }]
    };
  }
  createWeightChart() {
    this.chartWeight = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: 'spline',
        //the height is fixed because of the rotation of the smartphone
        height: 300,
      },
      //credits are disabled, default is enabled
      credtis: {
        enabled: false,
      },
      //title isn't set, it's set directly in html with <h2>-tag
      title: {
        text: null,
      },
      //the lables in the x-axis are the dates of the measurements
      xAxis: {
        type: 'datetime'
      },
      //on the y-axis, the unit is shown and it starts on zero. with opposite = false,
      //the y-axis is on the right side
      yAxis: {
        title: {
          text: 'kg',
        },
        min: 0,
        opposite: false,
      },
      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        valueSuffix: ' kg',
        followTouchMove: false,
        followPointer: false
      },
      //navigator, range selector and scrollbar aren't visible - reason of usability

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
      //the legend isn't visible, so the user can't disable e serie of data
      legend: {
        enabled: false
      },
      //the title of the serie is given from MeasurementsPage, also the data
      series: [{
        name: 'Gewicht',
        data: this.valuesWeight,
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 5,
        },
        //if a mark is selected, a thin line is visible
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }]
    };
  }
}
