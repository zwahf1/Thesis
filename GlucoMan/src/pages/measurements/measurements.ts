import { Component, ViewChild } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
import { NavController, NavParams, LoadingController, AlertController, ActionSheetController, Slides, Content } from 'ionic-angular';
import { Chart } from '../../util/Chart';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as  TYPES from '../../util/typings/MIDATA_Types';

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
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

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
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionCtrl: ActionSheetController) {
    this.storage.ready().then(() => {
      this.storage.get('VitalRangeList').then((val) => {
        if (val == undefined) {
          this.vitalRangeList.push(new VitalRange('Glukose', 0, 0, 'mmol/L', new Date));
          this.vitalRangeList.push(new VitalRange('Diastolischer BD', 0, 0, 'mmHg', new Date));
          this.vitalRangeList.push(new VitalRange('Systolischer BD', 0, 0, 'mmHg', new Date));
          this.vitalRangeList.push(new VitalRange('Puls', 0, 0, '/min', new Date));
          this.vitalRangeList.push(new VitalRange('Gewicht', 0, 0, 'kg', new Date));
          this.storage.set('VitalRangeList', this.vitalRangeList);
        }
      });
      this.storage.set('changeTheMeasurementsView', true);
    });
  }

  focusOver(){
    this.slides.lockSwipes(true);
  }
  focusLeave(){
    this.slides.lockSwipes(false);
  }

  slideChanged() {
    this.content.scrollToTop();
  }

  /**
   * when page was entered, get visible list and targetrange list.
   * update charts if changes are made
   */
  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('addNewValueFromHome').then((val) => {
        //if there's a value in 'NutritionDetailList', load it to local variable
        if(val != "" && val != undefined) {
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

      this.storage.get('changeTheMeasurementsView').then((val) => {
        if (val) {
          this.storage.set('changeTheMeasurementsView', false);
          this.storage.get('VitalRangeList').then((val) => {
            if (val) {
              this.vitalRangeList = val;
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
            this.refreshPage("all");
          });
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
        this.openAddAlert("Blutzucker");
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

      case "Mess-Art": {
        alert.addInput({
          type: 'radio',
          label: 'Vor dem Essen',
          value: 'Vor dem Essen',
          checked: true
        });
        alert.addInput({
          type: 'radio',
          label: 'Nach dem Essen',
          value: 'Nach dem Essen'
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
      this.saveMIDATAGlucose(gluco.value, d, e);
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
   * @param  {string} e event of measurement
   *
   */
  saveMIDATAGlucose(v: number, d: Date, e: string) {
    this.mp.save(this.getGlucoseRes(v, d, e));
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
          code: '29463-7',
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
   * @param  {string}                           e event of measurement
   * @return {TYPES.FHIR_ObservationRes_1Value}   JSON of FHIR resource
   */
  getGlucoseRes(v: number, d: Date, e: string): TYPES.FHIR_ObservationRes_1Value {
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
      },
      comment: e
    } as TYPES.FHIR_ObservationRes_1Value;
    return glucose;
  }
}
