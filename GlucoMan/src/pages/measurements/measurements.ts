import { Component } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
import { NavController, LoadingController, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { Chart } from '../../util/Chart';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as  TYPES from '../../util/typings/MIDATA_Types';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


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

  /**
                    constructor

  create the medication page with parameters
    - navCtrl: navigation controller to navigate between pages
    - storage: local storage

  storage SET:
    -glucoseValues: the measurements of the blood glucose
    -bpValues: the measurements of the blood pressure
    -pulseValues: the measurements of the pulse
    -weightValues: the measurements of the scale
**/
  constructor(public navCtrl: NavController, public storage: Storage, public platform: Platform, public loadingCtrl: LoadingController,
                public alertCtrl: AlertController, public actionCtrl: ActionSheetController, public bls: BluetoothSerial) {


    this.storage.ready().then(() => {
      this.storage.get('glucoseValues').then((val) => {
        if (val) {
          this.valuesGlucose = val;
        } else {
          this.valuesGlucose = [[Date.UTC(2016, 3, 4), 2], [Date.UTC(2016, 3, 5), 4], [Date.UTC(2016, 3, 7), 6], [Date.UTC(2016, 3, 8), 8],
            [Date.UTC(2016, 3, 9), 10], [Date.UTC(2016, 3, 11), 9], [Date.UTC(2016, 3, 12), 8], [Date.UTC(2016, 3, 14), 9],
            [Date.UTC(2016, 3, 17), 10], [Date.UTC(2016, 3, 18), 11]];
          this.storage.set('glucoseValues', this.valuesGlucose);
        }
      });
      this.storage.get('bpValues').then((val) => {
        if (val) {
          this.valuesBP = val;
        } else {
          this.valuesBP = [[Date.UTC(2016, 3, 4), 71, 132], [Date.UTC(2016, 3, 5), 62, 124], [Date.UTC(2016, 3, 7), 73, 126], [Date.UTC(2016, 3, 8), 54, 118],
            [Date.UTC(2016, 3, 9), 65, 110], [Date.UTC(2016, 3, 11), 66, 119], [Date.UTC(2016, 3, 12), 57, 128], [Date.UTC(2016, 3, 14), 68, 129],
            [Date.UTC(2016, 3, 17), 79, 130], [Date.UTC(2016, 3, 18), 60, 121]];
          this.storage.set('bpValues', this.valuesBP);
        }
      });
      this.storage.get('pulseValues').then((val) => {
        if (val) {
          this.valuesPulse = val;
        } else {
          this.valuesPulse = [[Date.UTC(2016, 3, 4), 66], [Date.UTC(2016, 3, 5), 77], [Date.UTC(2016, 3, 7), 65], [Date.UTC(2016, 3, 8), 61],
            [Date.UTC(2016, 3, 9), 62], [Date.UTC(2016, 3, 11), 75], [Date.UTC(2016, 3, 12), 83], [Date.UTC(2016, 3, 14), 59],
            [Date.UTC(2016, 3, 17), 65], [Date.UTC(2016, 3, 18), 73]];
          this.storage.set('pulseValues', this.valuesPulse);
        }
      });
      this.storage.get('weightValues').then((val) => {
        if (val) {
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
/**
if the view did enter, the latest stored visibleList and target range list
loads to local variables.
if there's no vitalRangeList available, the default values loads, they're 0.
**/
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
          this.storage.set('VitalRangeList', this.vitalRangeList);
        }
        this.refreshPage();
      });
    });
  }
/**
method to refresh the page and redraw the charts.

while the charts are creating, the loading indicator is presented.
**/
  refreshPage() {
    let loading = this.loadingCtrl.create();

    loading.present();
    //the charts are created by the Chart-class
    this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', this.valuesGlucose, this.vitalRangeList[0].lowerLimit, this.vitalRangeList[0].upperLimit, 0, 0);
    this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', this.valuesBP, this.vitalRangeList[1].lowerLimit, this.vitalRangeList[1].upperLimit, this.vitalRangeList[2].lowerLimit, this.vitalRangeList[2].upperLimit);
    this.chartPulse = new Chart('spline', 'Puls', 'pro Min', this.valuesPulse, this.vitalRangeList[3].lowerLimit, this.vitalRangeList[3].upperLimit, 0, 0);
    this.chartWeight = new Chart('spline', 'Gewicht', 'kg', this.valuesWeight, this.vitalRangeList[4].lowerLimit, this.vitalRangeList[4].upperLimit, 0, 0);
    this.createAllChart();
    loading.dismiss();
  }
/**
method to collapse and expand the charts.
it's called by clicking on a divider between the charts
**/
  expand(src) {
    //source navigate to the chart tag and store it to 'element'
    let element = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
    //mode is the style attribute of the chart element
    let mode = '' + element.getAttribute('style');
    //if 'style' contains the word 'none', the method 'search' returns a positive value, otherwise -1
    if (mode.search('none') < 0) {
      //the attribute 'display' is set to none to hide the chart
      element.style.display = 'none';
    } else if (mode.search('none') > 0) {
      //the attribute 'display' is set to inline to show the chart
      element.style.display = 'inline';
    }
  }
/**
method to hide and show the charts.
it's based on the visibleList, which is editable in the settings.
**/
  hideCharts() {
    for (var key in this.visibleList) {
      var x = document.getElementById(key);
      if (this.visibleList[key]) {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  }
  /**
  method to create the general chart with all vital signs.
  it's a combine chart with multiple chart types
  **/
  createAllChart() {
    this.chartAll = {
      chart: {
        //the size and spacing of the chart
        spacingLeft: 0,
        spacingRight: 10,
        width: window.innerWidth,
        height: 300,
        //position of the resetZoomButton
        resetZoomButton: {
          position: {
            verticalAlign: 'bottom',
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
        //there are two yAxis, on the left and on the right side, cause the different values.
        //on the left side there are values between 0 and 150, on the right side betweend 0 and 15
        title: { text: 'Blutdruck, Puls und Gewicht' },
        min: 0,
        opposite: false,
      }, {
        title: { text: 'Blutzucker' },
        min: 0,
        opposite: true,
      }], series: [{
        //series of the vital signs
          type: 'spline',
          name: 'Blutzucker',
          yAxis: 1,
          data: this.valuesGlucose,
          tooltip: {
            valueSuffix: ' mmol/L'
          }
        }, {
            type: 'columnrange',
            name: 'Blutdruck',
            yAxis: 0,
            data: this.valuesBP,
            tooltip: {
              valueSuffix: ' mmHg'
            }
          }, {
            type: 'spline',
            name: 'Puls',
            yAxis: 0,
            data: this.valuesPulse,
            tooltip: {
              valueSuffix: ' pro Min'
            }
          }, {
            type: 'spline',
            name: 'Gewicht',
            yAxis: 0,
            data: this.valuesWeight,
            tooltip: {
              valueSuffix: ' kg'
            }
          }],
      //the legend isn't visible, so the user can't disable e serie of data
      legend: {
        enabled: true
      },
      navigator: {
        enabled: false
      },
      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        shared: true,
        xDateFormat: '%d.%m.%Y %H:%M',
        followTouchMove: false,
        followPointer: false
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
/**
method to choose the vital sign for the new measurement value.
after the selection it calls the method openAddAlert() with the vital sign as parameter
**/
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
/**
method to entry the new value
**/
  openAddAlert(typ) {
    let alert = this.alertCtrl.create({});
    alert.setTitle(typ);
    //two input fields for blood pressure
    if (typ === "Blutdruck") {
      alert.addInput({
        type: 'number',
        name: 'sys',
        placeholder: 'Systolischer Blutdruck'
      });
      alert.addInput({
        type: 'number',
        name: 'dia',
        placeholder: 'Diastolischer Blutdruck'
      });
      //choose import of a device or manually input
    } else if(typ === "Glukose") {
      alert.addInput({
        type: 'radio',
        label: 'Import von Gerät',
        value: 'Import',
        checked: true
      });
      alert.addInput({
        type: 'radio',
        label: 'Tastatureingabe',
        value: 'Blutzucker'
      });

    } else if(typ === "Import") {
      alert.setMessage("Aktivierung des Bluetooth vom Blutzucker-Messgerät");

    } else if(typ === "Blutzucker") {
      alert.addInput({
        type: 'radio',
        label: 'Vor dem Essen',
        value: 'Befor'
      });
      alert.addInput({
        type: 'radio',
        label: 'Nach dem Essen',
        value: 'After'
      });

    } else {
      //one input field for other vital signs
      alert.addInput({
        type: 'number',
        name: 'data',
        placeholder: typ
      });
    }
    // button to cancel
    alert.addButton('Cancel');
    // button for save value
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
            //parse the data into numbers to add to the chart
            let v1: number = parseInt(data.sys);
            let v2: number = parseInt(data.dia);
            let v: number = parseInt(data.data);
            //switch - case to handle the different input types
            switch (typ) {
              case "Blutdruck": {
                this.addBloodPressure(v1, v2, new Date());
                break;
              }
              case "Puls": {
                this.addPulse(v, new Date());
                break;
              }
              case "Gewicht": {
                this.addWeight(v, new Date());
                break;
              }
              case "Glukose": {
                this.openAddAlert(data);
                break;
              }
              case "Blutzucker": {
                this.addGlucose(v, new Date());
                break;
              }
              case "Import": {
                this.storage.get('deviceId').then((val) => {
                  for(var i = 0;i < val.length;i++) {
                    if(val[i].name === "myglucohealth") {
                      this.importFromDevice(val[i].id);
                    }
                  }
                })
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

  importFromDevice(id) {
    var dataLength = new Uint8Array(6);
    var index: number = 0;
    var result = new Uint8Array(7);
    dataLength[0] = 0x80;
    dataLength[1] = 0x01;
    dataLength[2] = 0xFE;
    dataLength[3] = 0x00;
    dataLength[4] = 0x81;
    dataLength[5] = 0xFE;

    let loading = this.loadingCtrl.create();

    loading.present();

    this.bls.enable().then(() => {
      this.bls.connect(id).subscribe(() => {
        console.log("connected");
        var dataValues = new Uint8Array(7);
        this.bls.write(dataLength).then(() => {
        });

        this.bls.subscribeRawData().subscribe((subs) => {
          var a = new Uint8Array(subs);
          console.log("By index: "+index);
          console.log(a[0]);
          result[index] = (a[0]);
          if(index == 6) {
            console.log("get Values");
            console.log(result);
            this.getBluetoothValues(result[4]);

            loading.dismiss();
          } else {
            index++;
          }
        });
      });
    });
  }
  /**
method to add weight value into weightlist, chart and MIDATA
  **/
  getBluetoothValues(num: number) {
    var dataValues = new Uint8Array((num*7));
    var result = new Uint8Array((num*6));
    var dataRead = 0;
    var byteRead = 0;
    var firstCmd: boolean = false;
    var secondCmd: boolean = false;

    for(var i = 0; i < num;i++) {
      dataValues[(0+(i*7))] = 0x80;
      dataValues[(1+(i*7))] = 0x02;
      dataValues[(2+(i*7))] = 0xFD;
      dataValues[(3+(i*7))] = 0x01;
      dataValues[(4+(i*7))] = i;
      dataValues[(5+(i*7))] = (((0x80^0xFD)^i)^0xFF);
      dataValues[(6+(i*7))] = 0xFC;
    }
    console.log(dataValues);

    this.bls.isConnected().then(() => {
      console.log("already connected");

      this.bls.write(dataValues).then(() => {
      });

      this.bls.subscribeRawData().subscribe((subs) => {
        var a = new Uint8Array(subs);

        if((a[0] == 1) && !firstCmd && !secondCmd) {
          firstCmd = true;
        } else if((a[0] == dataRead) && firstCmd && !secondCmd) {
          secondCmd = true;
        } else if(firstCmd && secondCmd) {
          result[((dataRead*6)+byteRead)] = a[0];
          console.log(result);
          byteRead++;
          if(byteRead == 6) {
            byteRead = 0;
            dataRead++;
            firstCmd = false;
            secondCmd = false;
          }
        }

        if(dataRead == num) {
          dataRead = 0;
          console.log(result);
          this.addGlucoseValues(result);
          this.bls.disconnect().then(() => {
            console.log("disconnect");
          });
        }
      });
    });
  }

  registerNewDevice() {
    this.bls.list().then((val) => {
      // If stroage is ready to use
      this.storage.ready().then(() => {
        this.storage.set('deviceId',val);
        console.log(val);
      });

    });
  }

  addWeight(v,d) {
    this.valuesWeight.push([d.getTime(),v]);
    this.storage.ready().then(() => {
      this.storage.set('weightValues', this.valuesWeight);
      this.saveMIDATAWeight(v, d);
      this.refreshPage();
    });
  }
  /**
method to add pulse value into weightlist, chart and MIDATA
  **/
  addPulse(v, d) {
    this.valuesPulse.push([d.getTime(), v]);
    this.storage.ready().then(() => {
      this.storage.set('pulseValues', this.valuesPulse);
      this.saveMIDATAPulse(v, d);
      this.refreshPage();
    });
  }
  /**
method to add blood pressure values into weightlist, chart and MIDATA
  **/
  addBloodPressure(v1: number, v2: number, d) {
    this.valuesBP.push([d.getTime(), v1, v2]);
    this.storage.ready().then(() => {
      this.storage.set('bpValues', this.valuesBP);
      this.saveMIDATABloodPressure(v2, v1, d);
      this.refreshPage();
    });
  }
  /**
method to add glucose value into weightlist, chart and MIDATA
  **/
  addGlucose(v, d) {
    this.valuesGlucose.push([d.getTime(),v]);
    this.storage.ready().then(() => {
      this.storage.set('glucoseValues', this.valuesGlucose);
      this.saveMIDATAGlucose(v, d);
      this.refreshPage();
    });
  }

  addGlucoseValues(array: Uint8Array) {
    var gluco: {value: any, date: any};
    var num = array.length / 6;
    for(var i = 0; i < num; i++) {
      console.log("input: "+array[i]+" | "+array[(i+1)]+" | "+array[(i+2)]+" | "+array[(i+3)]+" | "+array[(i+4)]+" | "+array[(i+5)]+" | ");
      gluco = this.getGlucoseRepresentation(array[(i*6)],array[((i*6)+1)],array[((i*6)+2)],array[((i*6)+3)],array[((i*6)+4)],array[((i*6)+5)]);
      if(this.checkValue(gluco.value, gluco.date, this.valuesGlucose)) {
        console.log("Value already exist");
      } else {
        this.addGlucose(gluco.value, gluco.date);
        console.log("Added new Value");
      }
    }
  }

  checkValue(v1,d1,array: any[][]): boolean {
    var match: boolean = true;
    var num = array.indexOf([d1,v1]);
    if(num == -1) {
      match = false;
    }
    return match;
  }

  getGlucoseRepresentation(byte1, byte2, byte3, byte4, byte5, byte6) {
    var result: {value: any, date: any};
    result = {
      value: ((((byte3&0x03)<<8)+byte4)/18),
      date: new Date(((byte1>>1)+2000),(((byte1&0x01)<<3)+(byte2>>5)-1),(byte2&0x1f),(((byte5&0x07)<<2)+(byte6>>6)),(byte6&0x3f))
    }
    return result;
  }

  saveMIDATAWeight(v,d) {
    this.mp.save(this.getWeightRes(v,d));
  }

  saveMIDATAPulse(v, d) {
    this.mp.save(this.getPulseRes(v, d));
  }

  saveMIDATABloodPressure(v1, v2, d) {
    this.mp.save(this.getBloodPressureRes(v1, v2, d));
  }

  saveMIDATAGlucose(v, d) {
    this.mp.save(this.getGlucoseRes(v, d));
  }

  getMIDATAObservations() {
    var o = this.mp.search("Observation");
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

  getWeightRes(v, d) {
    var weight: TYPES.FHIR_ObservationRes_1Value;
    weight = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding: [{
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

  getPulseRes(v, d) {
    var pulse: TYPES.FHIR_ObservationRes_1Value;
    pulse = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding: [{
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

  getBloodPressureRes(v1, v2, d) {
    var bp: TYPES.FHIR_ObservationRes_2Value;
    bp = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding: [{
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
            coding: [{
              system: 'http://loinc.org',
              display: 'Systolic blood pressure',
              code: '8480-6'
            }]
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
            coding: [{
              system: 'http://loinc.org',
              display: 'Diastolic blood pressure',
              code: '8462-4'
            }]
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

  getGlucoseRes(v, d) {
    var glucose: TYPES.FHIR_ObservationRes_1Value;
    glucose = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding: [{
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
