import { Component } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
import { NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { Chart } from '../../util/Chart';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as  TYPES from '../../util/typings/MIDATA_Types';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * measurements page for tabs page
 * @param  {'page-measurements'}  {selector   [description]
 * @param  {'measurements.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-measurements',
  templateUrl: 'measurements.html'
})

export class MeasurementsPage {

  private mp = MidataPersistence.getInstance();

  chartAll: any;
  chartGluco: Chart;
  chartBP: Chart;
  chartPulse: Chart;
  chartWeight: Chart;
  glucoseUnit: string = 'mmol/L';
  valuesGlucose: TYPES.LOCAL_Glucose[] = [];

  visibleList = [];
  vitalRangeList = [];

  valuesGlucoseChart = [];
  valuesBP = [];
  valuesPulse = [];
  valuesWeight = [];

  /**
   * get all values, visible list and targetrange list form storage and create all charts.
   * if no values are saved, get from midata
   * @param  {NavController}         publicnavCtrl     navigation of app
   * @param  {NavParams}             publicnavParams   navigation parameters
   * @param  {Storage}               publicstorage     ionic storage from phone
   * @param  {LoadingController}     publicloadingCtrl show loading
   * @param  {AlertController}       publicalertCtrl   handle alerts
   * @param  {ActionSheetController} publicactionCtrl  handle action sheets
   * @param  {BluetoothSerial}       publicbls         connection to bluetooth devices
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionCtrl: ActionSheetController,
    public bls: BluetoothSerial) {

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
      });
      this.storage.get('glucoseValues').then((val) => {
        if (val) {
          this.valuesGlucose = val;
        }
        // else {
          // this.valuesGlucose = [{ date: new Date(2017, 3, 3), value: 2.2, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 5), value: 5.2, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 7), value: 6.3, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 8), value: 4.3, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 10), value: 7.6, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 14), value: 5.0, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 17), value: 3.3, event: "Nicht verfügbar" },
          //   { date: new Date(2017, 3, 20), value: 5.7, event: "Nicht verfügbar" }];
        //   this.storage.set('glucoseValues', this.valuesGlucose);
        // }
      });
      this.storage.get('bpValues').then((val) => {
        if (val) {
          this.valuesBP = val;
        }
        // else {
          // this.valuesBP = [[Date.UTC(2017, 3, 4), 132, 71], [Date.UTC(2017, 3, 5), 124, 62], [Date.UTC(2017, 3, 7), 126, 73], [Date.UTC(2017, 3, 8), 118, 54],
          //   [Date.UTC(2017, 3, 9), 110, 65], [Date.UTC(2017, 3, 11), 119, 66], [Date.UTC(2017, 3, 12), 128, 57], [Date.UTC(2017, 3, 14), 129, 68],
          //   [Date.UTC(2017, 3, 17), 130, 79], [Date.UTC(2017, 3, 18), 121, 60]];
        //   this.storage.set('bpValues', this.valuesBP);
        // }
      });
      this.storage.get('pulseValues').then((val) => {
        if (val) {
          this.valuesPulse = val;
        }
        // else {
          // this.valuesPulse = [[Date.UTC(2017, 3, 4), 66], [Date.UTC(2017, 3, 5), 77], [Date.UTC(2017, 3, 7), 65], [Date.UTC(2017, 3, 8), 61],
          //   [Date.UTC(2017, 3, 9), 62], [Date.UTC(2017, 3, 11), 75], [Date.UTC(2017, 3, 12), 83], [Date.UTC(2017, 3, 14), 59],
          //   [Date.UTC(2017, 3, 17), 65], [Date.UTC(2017, 3, 18), 73]];
        //   this.storage.set('pulseValues', this.valuesPulse);
        // }
      });
      this.storage.get('weightValues').then((val) => {
        if (val) {
          this.valuesWeight = val;
        }
        // else {
          // this.valuesWeight = [[Date.UTC(2017, 3, 4), 76.5], [Date.UTC(2017, 3, 5), 77.6], [Date.UTC(2017, 3, 7), 75.0], [Date.UTC(2017, 3, 8), 76.3],
          //   [Date.UTC(2017, 3, 9), 76.7], [Date.UTC(2017, 3, 11), 77.5], [Date.UTC(2017, 3, 12), 77.8], [Date.UTC(2017, 3, 14), 78.1],
          //   [Date.UTC(2017, 3, 17), 74.9], [Date.UTC(2017, 3, 18), 75.7]];
        //   this.storage.set('weightValues', this.valuesWeight);
        // }
        this.refreshPage("all");
      });
    });
  }

  /**
   * when page was entered, get visible list and targetrange list.
   * update charts if changes are made
   */
  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('addNewValueFromHome').then((val) => {
        //if there's a value in 'NutritionDetailList', load it to local variable
        if (val == 'Blutzucker') {
          this.openActionSheetGlucose();
        } else if(val != "" && val != undefined) {
          this.openAddAlert(val);
        }
        this.storage.set('addNewValueFromHome',"");
      });
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
      });
      this.storage.get('glucoseValues').then((val) => {
        if (val) {
          this.valuesGlucose = val;
        }
      });
      this.storage.get('bpValues').then((val) => {
        if (val) {
          this.valuesBP = val;
        }
      });
      this.storage.get('pulseValues').then((val) => {
        if (val) {
          this.valuesPulse = val;
        }
      });
      this.storage.get('weightValues').then((val) => {
        if (val) {
          this.valuesWeight = val;
        }
      });
      this.storage.get('changeTheMeasurementsView').then((val) => {
        if (val) {
          this.storage.set('changeTheMeasurementsView', false);
          this.refreshPage("all");
        }
      });
    });
  }

  /**
   * refresh all charts of given typ
   * @param  {string} typ chart typ to refresh | all, g, p, bp, w
   */
  refreshPage(typ: string) {
    let loading = this.loadingCtrl.create();
    loading.present();

    if(typ == "g" || typ == "all") {
      if (this.valuesGlucose.length > this.valuesGlucoseChart.length) {
        for (var i = 0; i < this.valuesGlucose.length; i++) {
          this.valuesGlucoseChart[i] = [this.valuesGlucose[i].date.getTime(), this.valuesGlucose[i].value];
        }
      }
    }

    switch(typ) {
      case "all": {
        //the charts are created by the Chart-class
        this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', this.valuesGlucoseChart, 25, this.vitalRangeList[0].lowerLimit, this.vitalRangeList[0].upperLimit, 0, 0);
        this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', this.valuesBP, null, this.vitalRangeList[1].lowerLimit, this.vitalRangeList[1].upperLimit, this.vitalRangeList[2].lowerLimit, this.vitalRangeList[2].upperLimit);
        this.chartPulse = new Chart('spline', 'Puls', '/min', this.valuesPulse, null, this.vitalRangeList[3].lowerLimit, this.vitalRangeList[3].upperLimit, 0, 0);
        this.chartWeight = new Chart('spline', 'Gewicht', 'kg', this.valuesWeight, null, this.vitalRangeList[4].lowerLimit, this.vitalRangeList[4].upperLimit, 0, 0);
        break;
      }
      case "g": {
        this.chartGluco = new Chart('spline', 'Blutzucker', 'mmol/L', this.valuesGlucoseChart, 25, this.vitalRangeList[0].lowerLimit, this.vitalRangeList[0].upperLimit, 0, 0);
        break;
      }
      case "p": {
        this.chartPulse = new Chart('spline', 'Puls', '/min', this.valuesPulse, null, this.vitalRangeList[3].lowerLimit, this.vitalRangeList[3].upperLimit, 0, 0);
        break;
      }
      case "bp": {
        this.chartBP = new Chart('columnrange', 'Blutdruck', 'mmHg', this.valuesBP, null, this.vitalRangeList[1].lowerLimit, this.vitalRangeList[1].upperLimit, this.vitalRangeList[2].lowerLimit, this.vitalRangeList[2].upperLimit);
        break;
      }
      case "w": {
        this.chartWeight = new Chart('spline', 'Gewicht', 'kg', this.valuesWeight, null, this.vitalRangeList[4].lowerLimit, this.vitalRangeList[4].upperLimit, 0, 0);
        break;
      }
    }
    this.createAllChart();

    loading.dismiss();
  }

  /**
   * expand or collapse the given chart
   * @param  {any} src div of chart to collapse/expand
   */
  expand(src: any) {
    try {
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
    } catch (Error) {
      //source navigate to the chart tag and store it to 'element'
      let element = src.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
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
  }

  /**
   * expand or collapse the given measurements
   * @param  {any}    src div of measurements to collapse/expand
   */
  expandValues(src: any) {
    try {
      let element = src.parentNode.parentNode.parentNode.nextElementSibling;
      //mode is the style attribute of the chart element
      let mode = '' + element.getAttribute('style');
      //if 'style' contains the word 'none', the method 'search' returns a
      //positive value, otherwise -1
      if (mode.search('none') < 0) {
        //the attribute 'display' is set to none to hide the chart
        element.style.display = 'none';
      } else if (mode.search('none') > 0) {
        //the attribute 'display' is set to inline to show the chart
        element.style.display = 'inline';
      }
    } catch (Error) {
      console.log('catched :)');
      let element = src.parentNode.parentNode.nextElementSibling;
      //mode is the style attribute of the chart element
      let mode = '' + element.getAttribute('style');
      //if 'style' contains the word 'none', the method 'search' returns a
      //positive value, otherwise -1
      if (mode.search('none') < 0) {
        //the attribute 'display' is set to none to hide the chart
        element.style.display = 'none';
      } else if (mode.search('none') > 0) {
        //the attribute 'display' is set to inline to show the chart
        element.style.display = 'inline';
      }
    }
  }

  /**
   * show all charts from visible list
   */
  hideCharts() {
    for (var key in this.visibleList) {
      let  elements = (<HTMLElement[]><any>document.getElementsByClassName(key));
      for(let e of elements ){
        if (this.visibleList[key]) {
          e.style.display = 'block';
        } else {
          e.style.display = 'none';
        }
    }
    }
  }

  /**
   * create a chart with all measurements
   */
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
          max: 25,
          min: 0,
          opposite: true,
        }], series: [{
          //series of the vital signs
          type: 'spline',
          name: 'Blutzucker',
          yAxis: 1,
          data: this.valuesGlucoseChart,
          tooltip: {
            valueSuffix: ' mmol/L'
          },
          lineWidth: 0,
          marker: {
            enabled: true,
            radius: 5,
          },
        }, {
            type: 'columnrange',
            name: 'Blutdruck',
            yAxis: 0,
            data: this.valuesBP,
            tooltip: {
              valueSuffix: ' mmHg'
            },
          }, {
            type: 'spline',
            name: 'Puls',
            yAxis: 0,
            data: this.valuesPulse,
            tooltip: {
              valueSuffix: ' pro Min'
            },
            lineWidth: 0,
            marker: {
              enabled: true,
              radius: 5,
            },
          }, {
            type: 'spline',
            name: 'Gewicht',
            yAxis: 0,
            data: this.valuesWeight,
            tooltip: {
              valueSuffix: ' kg'
            },
            lineWidth: 2,
            marker: {
              enabled: true,
              radius: 5,
            },
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
   * open an action sheet for choosing a category to add a new value
   */
  openActionSheet() {
    let actionSheet = this.actionCtrl.create({});
    actionSheet.setTitle('Neuer Messwert hinzufügen');
    actionSheet.addButton({
      text: 'Glukose',
      icon: 'water',
      handler: () => {
        this.openActionSheetGlucose();
      }
    });
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
      text: 'Import von MIDATA',
      icon: 'download',
      handler: () => {
        // this.openAddAlert("Gewicht");
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
   * open an action sheet to choose between import or manual input of glucose values
   */
  openActionSheetGlucose() {
    let actionSheet = this.actionCtrl.create({});
    actionSheet.setTitle('Glukose');
    actionSheet.addButton({
      text: 'Import von Gerät',
      icon: 'download',
      handler: () => {
        this.openAddAlert("Import");
      }
    });
    actionSheet.addButton({
      text: 'Manuelle Eingabe',
      icon: 'create',
      handler: () => {
        this.openAddAlert("Blutzucker");
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
   * open an alert to add a new value of the given typ
   * if typ is 'Blutzucker', 'Gewicht' or 'Puls', take default alert
   * if glucose measure category (Mess-Art) is choosen, optional given value would be saved
   * @param  {string} typ      typ of saved value | Blutdruck, Import, Mess-Art, Blutzucker, Gewicht, Puls
   * @param  {number} glucoVal value to store for glucose | optional
   * @return {[type]}          [description]
   */
  openAddAlert(typ: string, glucoVal?: number) {
    let alert = this.alertCtrl.create({});
    alert.setTitle(typ);
    switch (typ) {

      case "Blutdruck": {
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
        break;
      }

      case "Import": {
        alert.setMessage("Bitte aktivieren Sie Bluetooth vom Blutzucker-Messgerät durch klicken auf den linken Knopf"+
        " (Pfeil nach oben)");
        // alert.
        break;
      }

      case "Mess-Art": {
        alert.addInput({
          type: 'radio',
          label: 'Vor dem Essen',
          value: 'Vor dem Essen'
        });
        alert.addInput({
          type: 'radio',
          label: 'Nach dem Essen',
          value: 'Nach dem Essen',
          checked: true
        });
        alert.addInput({
          type: 'radio',
          label: 'Nach Medikation',
          value: 'Nach Medikation'
        });
        alert.addInput({
          type: 'radio',
          label: 'Nach dem Sport',
          value: 'Nach dem Sport'
        });
        break;
      }

      default: {
        alert.addInput({
          type: 'number',
          name: 'data',
          placeholder: typ
        });
        break;
      }
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

            //switch - case to handle the different input types
            switch (typ) {
              case "Blutdruck": {
                let checkSys = true;
                let checkDia = true;
                let outOfRangeSys = false;
                let outOfRangeDia = false;
                let createAlert = false;
                let alertMessage = "";

                if(this.vitalRangeList[2].lowerLimit == this.vitalRangeList[2].upperLimit) {
                  checkSys = false;
                }
                if(this.vitalRangeList[1].lowerLimit == this.vitalRangeList[1].upperLimit) {
                  checkDia = false;
                }
                if(checkSys) {
                  if(data.sys < this.vitalRangeList[2].lowerLimit || data.sys > this.vitalRangeList[2].upperLimit) {
                    outOfRangeSys = true;
                  }
                }
                if(checkDia) {
                  if(data.dia < this.vitalRangeList[1].lowerLimit || data.dia > this.vitalRangeList[1].upperLimit) {
                    outOfRangeDia = true;
                  }
                }

                if(outOfRangeSys && outOfRangeDia) {
                  createAlert = true;
                  alertMessage = 'Die eingegebenen Werte für den '+'systolischen & diastolischen Blutdruck'.bold()+
                  ' sind ausserhalb der definierten Zielbereiche! Wollen Sie die Werte trotzdem speichern?';
                }
                else if(outOfRangeSys) {
                  createAlert = true;
                  alertMessage = 'Der eingegebene Wert für den '+'systolischen Blutdruck'.bold()+
                  ' ist ausserhalb des definierten Zielbereichs! Wollen Sie den Wert trotzdem speichern?';
                }
                else if(outOfRangeDia) {
                  createAlert = true;
                  alertMessage = 'Der eingegebene Wert für den '+'diastolischen Blutdruck'.bold()+
                  ' ist ausserhalb des definierten Zielbereichs! Wollen Sie den Wert trotzdem speichern?';
                }
                else {
                  this.addBloodPressure(data.sys, data.dia, new Date());
                }

                if(createAlert) {
                  let alert = this.alertCtrl.create({
                    title: 'Werte-Prüfung',
                    message: alertMessage
                  });
                  alert.addButton('Nein');
                  alert.addButton({
                    text: 'Ja',
                    handler: () => {
                      this.addBloodPressure(data.sys, data.dia, new Date());
                    }
                  });
                  alert.present();
                }
                break;
              }
              case "Puls": {
                let check = true;
                let outOfRange = false;

                if(this.vitalRangeList[3].lowerLimit == this.vitalRangeList[3].upperLimit) {
                  check = false;
                }

                if(check) {
                  if(data.data < this.vitalRangeList[3].lowerLimit || data.data > this.vitalRangeList[3].upperLimit) {
                    outOfRange = true;
                  }
                }

                if(outOfRange) {
                  let alert = this.alertCtrl.create({
                    title: 'Werte-Prüfung',
                    message: 'Der eingegebene Wert für den '+'Puls'.bold()+
                    ' ist ausserhalb des definierten Zielbereichs! Wollen Sie den Wert trotzdem speichern?'
                  });
                  alert.addButton('Nein');
                  alert.addButton({
                    text: 'Ja',
                    handler: () => {
                      this.addPulse(data.data, new Date());
                    }
                  });
                  alert.present();
                } else {
                  this.addPulse(data.data, new Date());
                }
                break;
              }
              case "Gewicht": {
                let check = true;
                let outOfRange = false;

                if(this.vitalRangeList[4].lowerLimit == this.vitalRangeList[4].upperLimit) {
                  check = false;
                }

                if(check) {
                  if(data.data < this.vitalRangeList[4].lowerLimit || data.data > this.vitalRangeList[4].upperLimit) {
                    outOfRange = true;
                  }
                }

                if(outOfRange) {
                  let alert = this.alertCtrl.create({
                    title: 'Werte-Prüfung',
                    message: 'Der eingegebene Wert für das '+'Gewicht'.bold()+
                    ' ist ausserhalb des definierten Zielbereichs! Wollen Sie den Wert trotzdem speichern?'
                  });
                  alert.addButton('Nein');
                  alert.addButton({
                    text: 'Ja',
                    handler: () => {
                      this.addWeight(data.data, new Date());
                    }
                  });
                  alert.present();
                } else {
                  this.addWeight(data.data, new Date());
                }
                break;
              }
              case "Blutzucker": {
                let check = true;
                let outOfRange = false;

                if(this.vitalRangeList[0].lowerLimit == this.vitalRangeList[0].upperLimit) {
                  check = false;
                }

                if(check) {
                  if(data.data < this.vitalRangeList[0].lowerLimit || data.data > this.vitalRangeList[0].upperLimit) {
                    outOfRange = true;
                  }
                }

                if(outOfRange) {
                  let alert = this.alertCtrl.create({
                    title: 'Werte-Prüfung',
                    message: 'Der eingegebene Wert für den '+'Blutzucker'.bold()+
                    ' ist ausserhalb des definierten Zielbereichs! Wollen Sie den Wert trotzdem speichern?'
                  });
                  alert.addButton('Nein');
                  alert.addButton({
                    text: 'Ja',
                    handler: () => {
                      this.openAddAlert("Mess-Art", data.data);
                    }
                  });
                  alert.present();
                } else {
                  this.openAddAlert("Mess-Art", data.data);
                }
                break;
              }
              case "Mess-Art": {
                this.addGlucose(glucoVal, new Date(), data);
                break;
              }
              case "Import": {
                this.storage.get('deviceId').then((val) => {
                  if (val) {
                    for (var i = 0; i < val.length; i++) {
                      if (val[i].name === "myglucohealth") {
                        this.importFromDevice(val[i].id);
                      }
                    }
                  } else {
                    let alert = this.alertCtrl.create({
                      title: 'Kein Gerät registriert',
                      subTitle: "Bitte registrieren Sie ihr Glukose-Messgerät unter: " + "Einstellungen > Bluetooth".bold(),
                      buttons: ['OK']
                    });
                    alert.present();
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

  /**
   * import measurements from bluetooth device with given id.
   * get number of saved values and open method getBluetoothValues()
   * @param  {string} id mac or uuid from bluetooth device
   */
  importFromDevice(id: string) {
    console.log("start import");
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

        this.bls.write(dataLength).then(() => {
        });

        this.bls.subscribeRawData().subscribe((subs) => {
          var a = new Uint8Array(subs);
          for (var i = 0; i < a.length; i++) {
            result[index] = a[i];
            index++;
          }

          if (index == 7) {
            console.log(result);
            loading.dismiss();
            this.getBluetoothValues(result[4]);
          }
        });
      });
    });
  }

  /**
   * get given number of glucose values and save them.
   * disconnect from device after response with all values
   * @param  {number} num number of values on device
   */
  getBluetoothValues(num: number) {
    var dataValues = new Uint8Array((num * 7));
    var result = new Uint8Array((num * 13));
    var byteArray = new Uint8Array((num * 6));
    var byteRead = 0;
    var saveBytes: boolean = false;
    var savedByte: number = 0;

    let loading = this.loadingCtrl.create();

    loading.present();

    for (var i = 0; i < num; i++) {
      dataValues[(0 + (i * 7))] = 0x80;
      dataValues[(1 + (i * 7))] = 0x02;
      dataValues[(2 + (i * 7))] = 0xFD;
      dataValues[(3 + (i * 7))] = 0x01;
      dataValues[(4 + (i * 7))] = i;
      dataValues[(5 + (i * 7))] = (((0x80 ^ 0xFD) ^ i) ^ 0xFF);
      dataValues[(6 + (i * 7))] = 0xFC;
    }

    this.bls.write(dataValues).then(() => {
    });

    this.bls.subscribeRawData().subscribe((subs) => {

      var a = new Uint8Array(subs);

      for (var i = 0; i < a.length; i++) {
        result[byteRead] = a[i];
        byteRead++;
      }

      console.log(byteRead);

      if (byteRead == (num * 13)) {
        byteRead = 0;
        console.log(result);
        for (var i = 0; i < result.length; i++) {

          if (saveBytes) {
            byteArray[savedByte] = result[i];
            savedByte++;
            if ((savedByte % 6) == 0) {
              saveBytes = false;
              byteRead++;
            }
          } else if (result[i] == byteRead) {
            if (result[(i - 1)] == 0x01) {
              saveBytes = true;
            }
          }
        }
        console.log(byteArray);
        loading.dismiss();
        this.addGlucoseValues(byteArray);
        this.bls.disconnect().then(() => {
          console.log("disconnect");
        });
      }
    });
  }

  /**
   * add new weight to chart and midata with given value and date
   * the value will be parsed to float and sorted
   * @param  {string} v value of weight
   * @param  {Date}   d date of measurement
   */
  addWeight(v: string, d: Date) {
    let val: number = parseFloat(v);
    this.valuesWeight.push([d.getTime(), val]);
    this.storage.ready().then(() => {
      this.storage.set('weightValues', this.valuesWeight.sort());
      this.saveMIDATAWeight(val, d);
      this.refreshPage("w");
    });
  }

  /**
   * add new pulse to chart and midata with given value and date
   * the value will be parsed to integer and sorted
   * @param  {any} v value of pulse
   * @param  {Date}   d date of measurement
   */
  addPulse(v: any, d: Date) {
    let val: number = parseInt(v);
    this.valuesPulse.push([d.getTime(), val]);
    this.storage.ready().then(() => {
      this.storage.set('pulseValues', this.valuesPulse.sort());
      this.saveMIDATAPulse(val, d);
      this.refreshPage("p");
    });
  }

  /**
   * add new blood pressure to chart and midata with given systolic and diastolic value and date
   * the values will be parsed to integer and sorted
   * @param  {any}    v1 systolic value of blood pressure
   * @param  {any}    v2 diastolic value of blood pressure
   * @param  {Date}   d  date of measurement
   */
  addBloodPressure(v1: any, v2: any, d: Date) {
    let val1: number = parseInt(v1);
    let val2: number = parseInt(v2);
    this.valuesBP.push([d.getTime(), val1, val2]);
    this.storage.ready().then(() => {
      this.storage.set('bpValues', this.valuesBP.sort());
      this.saveMIDATABloodPressure(val1, val2, d);
      this.refreshPage("bp");
    });
  }

  /**
   * add new glucose to chart and midata with given value, Date and event
   * the value will be parsed to float and sorted
   * @param  {any}    v value of glucose
   * @param  {Date}   d date of measurement
   * @param  {string} e event of measurement | Vor dem Essen, Nach dem Essen, Nach Medikation, Nach dem Sport
   */
  addGlucose(v: any, d: Date, e: string) {
    let gluco: TYPES.LOCAL_Glucose = {
      date: d,
      value: parseFloat(v),
      event: e
    }
    this.valuesGlucose.push(gluco);
    this.storage.ready().then(() => {
      this.storage.set('glucoseValues', this.valuesGlucose.sort(this.compareGlucoseValues));
      this.saveMIDATAGlucose(gluco.value, d);
      this.refreshPage("g");
    });
  }

  /**
   * add new glucose values to chart and midata with given array
   * the array contains valuesets from device myglucohealth
   * method: getBluetoothValues()
   * @param  {Uint8Array} array uint8 array with valuesets of glucose
   */
  addGlucoseValues(array: Uint8Array) {
    var gluco: TYPES.LOCAL_Glucose;
    var num = array.length / 6;
    for (var i = 0; i < num; i++) {

      console.log("input: " + array[(i * 6)] + " | " + array[((i * 6) + 1)] + " | " + array[((i * 6) + 2)] + " | " + array[((i * 6) + 3)] + " | " + array[((i * 6) + 4)] + " | " + array[((i * 6) + 5)]);
      let glucoRep = this.getGlucoseRepresentation(array[(i * 6)], array[((i * 6) + 1)], array[((i * 6) + 2)], array[((i * 6) + 3)], array[((i * 6) + 4)], array[((i * 6) + 5)]);

      let val: number = parseFloat(glucoRep.value);
      let date: Date = glucoRep.date;
      let event: string = glucoRep.event;
      gluco = {
        date: date,
        value: val,
        event: event
      }

      if (this.checkValue(gluco)) {
        console.log("Value already exist");
      } else {
        this.valuesGlucose.push(gluco);
        this.saveMIDATAGlucose(val, date);
        console.log("Added new Value");
      }
    }

    this.storage.ready().then(() => {
      this.storage.set('glucoseValues', this.valuesGlucose.sort(this.compareGlucoseValues));
      this.refreshPage("g");
    });
  }

  /**
   * compare 2 given glucose values and return
   * -1 for a<b | 0 for a=b | 1 for a>b
   * @param  {TYPES.LOCAL_Glucose} a glucose value to compare
   * @param  {TYPES.LOCAL_Glucose} b glucose value to compare
   * @return {number}                number representing compare
   */
  compareGlucoseValues(a: TYPES.LOCAL_Glucose, b: TYPES.LOCAL_Glucose): number {
    if (a.date.getTime() > b.date.getTime()) {
      return 1;
    } else if (a.date.getTime() == b.date.getTime()) {
      if ((a.value == b.value) && (a.event == b.event)) {
        return 0;
      } else if (a.value > b.value) {
        return 1;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }

  /**
   * check the given glucose value for already existing in glucose values
   * used for myglucohealth import to prevent dublicates
   * return true, if already existing, otherwise false
   * @param  {TYPES.LOCAL_Glucose} glucose glucose value to proof
   * @return {boolean}                     status existing
   */
  checkValue(glucose: TYPES.LOCAL_Glucose): boolean {
    var match: boolean = false;
    for (var i = 0; i < this.valuesGlucose.length; i++) {
      if (this.compareGlucoseValues(glucose, this.valuesGlucose[i]) == 0) {
        match = true;
      }
    }
    return match;
  }

  /**
   * get the glucose representation of the given 6 byte valueset
   * @param  {any}                                 byte1 byte 1 of valueset
   * @param  {any}                                 byte2 byte 2 of valueset
   * @param  {any}                                 byte3 byte 3 of valueset
   * @param  {any}                                 byte4 byte 4 of valueset
   * @param  {any}                                 byte5 byte 5 of valueset
   * @param  {any}                                 byte6 byte 6 of valueset
   * @return {{value: any, date: any, event: any}}       glucose representation of valueset
   */
  getGlucoseRepresentation(byte1: any, byte2: any, byte3: any, byte4: any, byte5: any, byte6: any): {value: any, date: any, event: any} {
    let result: {value: any, date: any, event: any};
    let event: any = ((byte5 & 0xf8) >> 3);
    if (event == 2) {
      event = "Nach dem Sport";
    } else if (event == 4) {
      event = "Nach Medikation";
    } else if (event == 8) {
      event = "Nach dem Essen";
    } else if (event == 16) {
      event = "Vor dem Essen";
    }

    result = {
      value: ((((byte3 & 0x03) << 8) + byte4) / 18).toFixed(1),
      date: new Date(((byte1 >> 1) + 2000), (((byte1 & 0x01) << 3) + (byte2 >> 5) - 1), (byte2 & 0x1f), (((byte5 & 0x07) << 2) + (byte6 >> 6)), (byte6 & 0x3f)),
      event: event
    }
    return result;
  }

  /**
   * save given weight value and date as FHIR weight resource
   * us for saving midataPersistence
   * @param  {number} v value of weight
   * @param  {Date}   d date of measurement
   */
  saveMIDATAWeight(v: number, d: Date) {
    this.mp.save(this.getWeightRes(v, d));
  }

  /**
   * save given pulse value and date as FHIR pulse resource
   * us for saving midataPersistence
   * @param  {number} v value of pulse
   * @param  {Date}   d date of measurement
   */
  saveMIDATAPulse(v: number, d: Date) {
    this.mp.save(this.getPulseRes(v, d));
  }

  /**
   * save given blood pressure values and date as FHIR blood pressure resource
   * us for saving midataPersistence
   * @param  {number} v1 systolic blood pressure
   * @param  {number} v2 diastolic blood pressure
   * @param  {Date}   d  date of measurement
   */
  saveMIDATABloodPressure(v1: number, v2: number, d: Date) {
    this.mp.save(this.getBloodPressureRes(v1, v2, d));
  }

  /**
   * save given glucose value and date as FHIR glucose resource
   * us for saving midataPersistence
   * @param  {number} v value of glucose
   * @param  {Date}   d date of measurement
   */
  saveMIDATAGlucose(v: number, d: Date) {
    this.mp.save(this.getGlucoseRes(v, d));
  }

  /**
   * get a representation of a FHIR resource for weight with given value and Date
   * return JSON of FHIR resource
   * @param  {number}                           v value of weight
   * @param  {Date}                             d date of measurement
   * @return {TYPES.FHIR_ObservationRes_1Value}   JSON of FHIR resource
   */
  getWeightRes(v: number, d: Date): TYPES.FHIR_ObservationRes_1Value {
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

  /**
   * get a representation of a FHIR resource for pulse with given value and Date
   * return JSON of FHIR resource
   * @param  {number}                           v value of pulse
   * @param  {Date}                             d date of measurement
   * @return {TYPES.FHIR_ObservationRes_1Value}   JSON of FHIR resource
   */
  getPulseRes(v: number, d: Date): TYPES.FHIR_ObservationRes_1Value {
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

  /**
   * get a representation of a FHIR resource for blood pressure with given values and Date
   * return JSON of FHIR resource
   * @param  {number}                           v1 value of systolic blood pressure
   * @param  {number}                           v2 value of diastolic blood pressure
   * @param  {Date}                             d  date of measurement
   * @return {TYPES.FHIR_ObservationRes_2Value}    JSON of FHIR resource
   */
  getBloodPressureRes(v1: number, v2: number, d: Date): TYPES.FHIR_ObservationRes_2Value {
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
            value: v1,
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
            value: v2,
            unit: 'mmHg',
            system: 'http://unitsofmeasure.org'
          }
        }
      ]
    } as TYPES.FHIR_ObservationRes_2Value;
    return bp;
  }

  /**
   * get a representation of a FHIR resource for glucose with given value and Date
   * return JSON of FHIR resource
   * @param  {number}                           v value of glucose
   * @param  {Date}                             d date of measurement
   * @return {TYPES.FHIR_ObservationRes_1Value}   JSON of FHIR resource
   */
  getGlucoseRes(v: number, d: Date): TYPES.FHIR_ObservationRes_1Value {
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
