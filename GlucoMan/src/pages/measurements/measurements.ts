import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { VitalRange } from '../../util/VitalRange';
import { NavController, LoadingController, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { Chart } from '../../util/Chart';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as  TYPES from '../../util/typings/MIDATA_Types';


@Component({
  selector: 'page-measurements',
  templateUrl: 'measurements.html'
})
export class MeasurementsPage {

  private mp = MidataPersistence.getInstance();

  chartAll: any;
  chartGluco: Chart;
  chartBP: any;
  chartPulse: any;
  chartWeight: any;
  glucoseUnit: string = 'mmol/L';

  visibleList = [];
  vitalRangeList = [];

  valuesGlucose = [[]];
  valuesBP = [[]];
  valuesPulse = [[]];
  valuesWeight = [[]];

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
  constructor(public navCtrl: NavController, public storage: Storage, public platform: Platform, public loadingCtrl: LoadingController,
                public alertCtrl: AlertController, public actionCtrl: ActionSheetController) {

    this.storage.ready().then(() => {
      this.storage.get('glucoseValues').then((val) => {
        if(val) {
          this.valuesGlucose = val;
        } else {
          this.valuesGlucose = [[Date.UTC(2016, 3, 4), 2], [Date.UTC(2016, 3, 5), 4], [Date.UTC(2016, 3, 7), 6], [Date.UTC(2016, 3, 8), 8],
            [Date.UTC(2016, 3, 9), 10], [Date.UTC(2016, 3, 11), 9], [Date.UTC(2016, 3, 12), 8], [Date.UTC(2016, 3, 14), 9],
            [Date.UTC(2016, 3, 17), 10], [Date.UTC(2016, 3, 18), 11]];
          this.storage.set('glucoseValues', this.valuesGlucose);
        }
      });
      this.storage.get('bpValues').then((val) => {
        if(val) {
          this.valuesBP = val;
        } else {
          this.valuesBP = [[Date.UTC(2016, 3, 4), 71, 132], [Date.UTC(2016, 3, 5), 62, 124], [Date.UTC(2016, 3, 7), 73, 126], [Date.UTC(2016, 3, 8), 54, 118],
            [Date.UTC(2016, 3, 9), 65, 110], [Date.UTC(2016, 3, 11), 66, 119], [Date.UTC(2016, 3, 12), 57, 128], [Date.UTC(2016, 3, 14), 68, 129],
            [Date.UTC(2016, 3, 17), 79, 130], [Date.UTC(2016, 3, 18), 60, 121]];
          this.storage.set('bpValues', this.valuesBP);
        }
      });
      this.storage.get('pulseValues').then((val) => {
        if(val) {
          this.valuesPulse = val;
        } else {
          this.valuesPulse = [[Date.UTC(2016, 3, 4), 66], [Date.UTC(2016, 3, 5), 77], [Date.UTC(2016, 3, 7), 65], [Date.UTC(2016, 3, 8), 61],
            [Date.UTC(2016, 3, 9), 62], [Date.UTC(2016, 3, 11), 75], [Date.UTC(2016, 3, 12), 83], [Date.UTC(2016, 3, 14), 59],
            [Date.UTC(2016, 3, 17), 65], [Date.UTC(2016, 3, 18), 73]];
          this.storage.set('pulseValues', this.valuesPulse);
        }
      });
      this.storage.get('weightValues').then((val) => {
        if(val) {
          this.valuesWeight = val;
        } else {
          this.valuesWeight = [[Date.UTC(2016, 3, 4), 76.5], [Date.UTC(2016, 3, 5), 77.6], [Date.UTC(2016, 3, 7), 75.0], [Date.UTC(2016, 3, 8), 76.3],
            [Date.UTC(2016, 3, 9), 76.7], [Date.UTC(2016, 3, 11), 77.5], [Date.UTC(2016, 3, 12), 77.8], [Date.UTC(2016, 3, 14), 78.1],
            [Date.UTC(2016, 3, 17), 74.9], [Date.UTC(2016, 3, 18), 75.7]];
          this.storage.set('weightValues', this.valuesWeight);
        }
      });
    });
  }

  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('VisibleList').then((val) => {
        if (val) {
          this.visibleList = val;
          this.hideCharts();
        }
      });
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        } else {
          this.vitalRangeList.push(new VitalRange('Glukose', 0, 0, 'mmol/L', new Date));
          this.vitalRangeList.push(new VitalRange('Diastolischer BD', 0, 0, 'mmHg', new Date));
          this.vitalRangeList.push(new VitalRange('Systolischer BD', 0, 0, 'mmHg', new Date));
          this.vitalRangeList.push(new VitalRange('Puls', 0, 0, '/min', new Date));
          this.vitalRangeList.push(new VitalRange('Gewicht', 0, 0, 'kg', new Date));
          this.storage.set('VitalRangeList',this.vitalRangeList);
        }
        this.refreshPage();
      });
    });
  }

  refreshPage() {
    let loading = this.loadingCtrl.create();

    loading.present();
    //the charts are created by the Chart-class
    this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', this.valuesGlucose, this.vitalRangeList[0].lowerLimit, this.vitalRangeList[0].upperLimit, 0, 0);
    this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', this.valuesBP, this.vitalRangeList[1].lowerLimit, this.vitalRangeList[1].upperLimit, this.vitalRangeList[2].lowerLimit, this.vitalRangeList[2].upperLimit);
    this.chartPulse = new Chart('spline', 'Puls', 'pro Min', this.valuesPulse, 0, 0, 0, 0);
    this.chartWeight = new Chart('spline', 'Gewicht', 'kg', this.valuesWeight, this.vitalRangeList[4].lowerLimit, this.vitalRangeList[4].upperLimit, 0, 0);
    this.createAllChart();

    loading.dismiss();
  }

  expand(src) {
    //source navigate to the chart tag and store it to 'element'
    let element = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
    //mode is the style attribute of the chart element
    let mode = ''+element.getAttribute('style');
    //if 'style' contains the word 'none', the method 'search' returns a positive value, otherwise -1
    if (mode.search('none') < 0) {
      //the attribute 'display' is set to none to hide the chart
      element.style.display = 'none';
    } else if (mode.search('none') > 0) {
      //the attribute 'display' is set to inline to show the chart
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
        spacingRight: 10,

        // Explicitly tell the width and height of a chart
        width: window.innerWidth,
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

  test() {
    this.addWeight(999,new Date());
    this.addPulse(999,new Date());
    this.addBloodPressure(998,999,new Date());
    this.addGlucose(999,new Date());
  }

  openActionSheet() {
    let actionSheet = this.actionCtrl.create({});
    actionSheet.setTitle('Neuer Messwert hinzufügen');
    actionSheet.addButton({
      text: 'Blutdruck',
      icon: 'heart',
      handler: () => {
        this.openAddAlert("Blutdruck");
      }
    });
    actionSheet.addButton({
      text: 'Puls',
      icon: 'pulse',
      handler: () => {
        this.openAddAlert("Puls");
      }
    });
    actionSheet.addButton({
      text: 'Gewicht',
      icon: 'speedometer',
      handler: () => {
        this.openAddAlert("Gewicht");
      }
    });
    actionSheet.addButton({
      text: 'Glukose',
      icon: 'water',
      handler: () => {
        this.openAddAlert("Glukose");
      }
    });
    actionSheet.addButton({
      text: 'Cancel',
      icon: 'close',
      role: 'destructive'
    });

    // present the alert popup
    actionSheet.present();
  }

  openAddAlert(typ) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle(typ);

    if(typ === "Blutdruck") {
      alert.addInput({
        type: 'number',
        name: 'dia',
        placeholder: 'Diastolischer Blutdruck'
      });
      alert.addInput({
        type: 'number',
        name: 'sys',
        placeholder: 'Systolischer Blutdruck'
      });
    } else if(typ === "Glukose") {
      alert.addInput({
        type: 'radio',
        label: 'Import von Gerät',
        value: 'Import'
      });
      // radio button (category)
      alert.addInput({
        type: 'radio',
        label: 'Tastatureingabe',
        value: 'Blutzucker'
      });
    } else {
      alert.addInput({
        type: 'number',
        name: 'data',
        placeholder: typ
      });
    }
    // button to cancel
    alert.addButton('Cancel');
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      // data: choosen category
      handler: (data) => {
        // user has clicked the new medication button
        // begin the alert's dismiss transition
        let navTransition = alert.dismiss();
        // If stroage is ready to use
        this.storage.ready().then(() => {
          navTransition.then(() => {

            switch(typ) {
              case "Blutdruck": {
                this.addBloodPressure(data.dia,data.sys,new Date());
                break;
              }
              case "Puls": {
                this.addPulse(data.data,new Date());
                break;
              }
              case "Gewicht": {
                console.log(new Date());
                this.addWeight(data.data,new Date());
                break;
              }
              case "Glukose": {
                if(data === "Import") {
                  this.importFromDevice();
                } else {
                  this.openAddAlert(data);
                }
                break;
              }
              case "Blutzucker": {
                this.addGlucose(data.data,new Date());
                break;
              }
            }
          });
        });
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }

  importFromDevice() {

  }

  addWeight(v,d) {
    this.valuesWeight.push([d.getTime(),v]);
    this.storage.ready().then(() => {
      this.storage.set('weightValues',this.valuesWeight);
      this.saveMIDATAWeight(v,d);
    });
    this.refreshPage();
  }

  addPulse(v,d) {
    this.valuesPulse.push([d.getTime(),v]);
    this.storage.ready().then(() => {
      this.storage.set('pulseValues',this.valuesPulse);
      this.saveMIDATAPulse(v,d);
    });
    this.refreshPage();
  }

  addBloodPressure(v1,v2,d) {
    this.valuesBP.push([d.getTime(),v1,v2]);
    this.storage.ready().then(() => {
      this.storage.set('bpValues',this.valuesBP);
      this.saveMIDATABloodPressure(v1,v2,d);
    });
    this.refreshPage();
  }

  addGlucose(v,d) {
    this.valuesGlucose.push([d.getTime(),v]);
    this.storage.ready().then(() => {
      this.storage.set('glucoseValues',this.valuesGlucose);
      this.saveMIDATAGlucose(v,d);
    });
    this.refreshPage();
  }

  saveMIDATAWeight(v,d) {
    this.mp.save(this.getWeightRes(v,d));
  }

  saveMIDATAPulse(v,d) {
    this.mp.save(this.getPulseRes(v,d));
  }

  saveMIDATABloodPressure(v1,v2,d) {
    this.mp.save(this.getBloodPressureRes(v1,v2,d));
  }

  saveMIDATAGlucose(v,d) {
    this.mp.save(this.getGlucoseRes(v,d));
  }

  getMIDATAObservations() {
    var o =this.mp.search("Observation");
    console.log(o);
    return o;
  }

  getMIDATAWeight() {

  }

  getMIDATAPulse() {

  }

  getMIDATABloodPressure() {

  }

  getMIDATAGlucose() {

  }

  getWeightRes(v,d) {
    var weight: TYPES.FHIR_ObservationRes_1Value;
    weight = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding:  [{
            system: "http://hl7.org/fhir/observation-category",
            code: "vital-signs",
            display: "Vital-Signs"
        }]
      },
      code: {
        text: "Gewicht",
        coding: [{
          system: 'http://loinc.org',
          code: '3141-9',
          display: 'Weight Measured'
        }]
      },
      valueQuantity: {
        value: v,
        unit: 'kg',
        system: 'http://unitsofmeasure.org'
      }
    } as TYPES.FHIR_ObservationRes_1Value;
    return weight;
  }

  getPulseRes(v,d) {
    var pulse: TYPES.FHIR_ObservationRes_1Value;
    pulse = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding:  [{
            system: "http://hl7.org/fhir/observation-category",
            code: "vital-signs",
            display: "Vital-Signs"
        }]
      },
      code: {
        text: "Herzfrequenz",
        coding: [{
          system: 'http://loinc.org',
          code: '8867-4',
          display: 'Herzfrequenz'
        }]
      },
      valueQuantity: {
        value: v,
        unit: 'bpm',
        system: 'http://unitsofmeasure.org'
      }
    } as TYPES.FHIR_ObservationRes_1Value;
    return pulse;
  }

  getBloodPressureRes(v1,v2,d) {
    var bp: TYPES.FHIR_ObservationRes_2Value;
    bp = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding:  [{
            system: "http://hl7.org/fhir/observation-category",
            code: "vital-signs",
            display: "Vital-Signs"
        }]
      },
      code: {
        text: "Blutdruck",
        coding: [{
          system: 'http://loinc.org',
          code: '55417-0',
          display: 'Blood Pressure'
        }]
      },
      component: [
        {
          code: {
            text: 'Systolic blood pressure',
            coding: [	{
                system: 'http://loinc.org',
                display: 'Systolic blood pressure',
                code: '8480-6'
            }	]
          },
          valueQuantity: {
            value: v2,
            unit: 'mmHg',
            system: 'http://unitsofmeasure.org'
          }
        },
        {
          code: {
            text: 'Diastolic blood pressure',
            coding: [ {
                system: 'http://loinc.org',
                display: 'Diastolic blood pressure',
                code: '8462-4'
            } ]
          },
          valueQuantity: {
            value: v1,
            unit: 'mmHg',
            system: 'http://unitsofmeasure.org'
          }
        }
      ]
    } as TYPES.FHIR_ObservationRes_2Value;
    return bp;
  }

  getGlucoseRes(v,d) {
    var glucose: TYPES.FHIR_ObservationRes_1Value;
    glucose = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding:  [{
            system: "http://hl7.org/fhir/observation-category",
            code: "laboratory",
            display: "Laboratory"
        }]
      },
      code: {
        text: "Glukose",
        coding: [{
          system: 'http://loinc.org',
          code: '15074-8',
          display: 'Glucose [Moles/volume] in blood'
        }]
      },
      valueQuantity: {
        value: v,
        unit: 'mmol/l',
        system: 'http://unitsofmeasure.org'
      }
    } as TYPES.FHIR_ObservationRes_1Value;
    return glucose;
  }
}
