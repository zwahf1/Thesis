import { Component } from '@angular/core';
import { App, PopoverController, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as TYPES from '../../util/typings/MIDATA_Types';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * data page for settings page
 * @param  {'page-data'}  {selector   [description]
 * @param  {'data.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  private mp = MidataPersistence.getInstance();
  medis1 : TYPES.LOCAL_MedicationStatementRes[] = [];
  medis2 : TYPES.LOCAL_MedicationStatementRes[] = [];
  medis3 : TYPES.LOCAL_MedicationStatementRes[] = [];
  medis4 : TYPES.LOCAL_MedicationStatementRes[] = [];
  glucose : TYPES.LOCAL_Glucose[] = [];
  bp = [];
  bpDia = [];
  bpSys = [];
  pulse = [];
  weight = [];

  /**
   *
   * @param  {App}                     publicappCtrl           handle root page
   * @param  {PopoverController}       publicpopoverCtrl       handle popovers
   * @param  {AlertController}         publicalertCtrl         handle alerts
   * @param  {Storage}                 publicstorage           ionic storage from phone
   * @param  {ActionSheetController}   publicactionSheetCtrl   handle action sheets
   */
  constructor(public appCtrl: App, public popoverCtrl: PopoverController, public alertCtrl: AlertController,
    public storage: Storage, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController,
    public bls: BluetoothSerial) {
    }

  /**
   * create popover to present the DisclaimerPage
   */
  presentPopover() {
    let popover = this.popoverCtrl.create(DisclaimerPage);
    popover.present();
  }

  /**
   * check if devices are registered, otherwise show alert to register it
   */
  openMyGlucoHealthImport() {
    this.storage.ready().then(() => {
      this.storage.get('deviceId').then((val) => {
        if (val) {
          for (var i = 0; i < val.length; i++) {
            if (val[i].name === "myglucohealth") {
              this.openActivationImport(val[i].id);
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
      });
    });
  }

  /**
   * open an alert to show activation of bluetooth
   */
  openActivationImport(id: string) {
    this.storage.ready().then(() => {
      let alert = this.alertCtrl.create({
        title: 'Aktivierung Bluetooth',
        subTitle: "Bitte aktivieren Sie Bluetooth auf dem Blutzucker-Messgerät durch klicken auf den linken Knopf"+
        " (Pfeil nach oben)".bold(),
        buttons: [
          {text: 'OK',
          handler: () => {
            this.storage.get('glucoseValues').then((val) => {
              if(val)
                this.glucose = val;
            });
            this.importFromDevice(id);
          }
        }]
      });
      alert.present();
    });
  }

  /**
   * open the action sheet to choose the import from MIDATA
   * Alle         | all observations and medications
   * Medikamente  | all medications
   * Blutzucker   | all glucoses
   * Blutdruck    | all blood pressures
   * Puls         | all pulses
   * Gewicht      | all weights
   */
  openMIDATAImport() {
    let actionSheet = this.actionSheetCtrl.create({});
    actionSheet.setTitle('MIDATA Import');
    actionSheet.addButton({
      text: 'Alle',
      icon: 'filing',
      handler: () => {
        // if storage is ready to use
        this.storage.ready().then(() => {
          // get all chronic medis
          this.storage.get('chronicMedis').then((val) => {
            if(val)
              this.medis1 = val;
          });
          this.storage.get('selfMedis').then((val) => {
            if(val)
              this.medis2 = val;
          });
          this.storage.get('insulin').then((val) => {
            if(val)
              this.medis3 = val;
          });
          this.storage.get('intolerances').then((val) => {
            if(val)
              this.medis4 = val;
            this.saveMIDATAMedications();
          });
          this.storage.get('glucoseValues').then((val) => {
            if(val)
              this.glucose = val;
          });
          this.storage.get('bpValues').then((val) => {
            if(val)
              this.bp = val;
          });
          this.storage.get('pulseValues').then((val) => {
            if(val)
              this.pulse = val;
          });
          this.storage.get('weightValues').then((val) => {
            if(val)
              this.weight = val;
            this.saveMIDATAObservations({});
          });
        });
      }
    });
    actionSheet.addButton({
      text: 'Medikamente',
      icon: 'medkit',
      handler: () => {
        // if storage is ready to use
        this.storage.ready().then(() => {
          // get all chronic medis
          this.storage.get('chronicMedis').then((val) => {
            if(val)
              this.medis1 = val;
          });
          this.storage.get('selfMedis').then((val) => {
            if(val)
              this.medis2 = val;
          });
          this.storage.get('insulin').then((val) => {
            if(val)
              this.medis3 = val;
          });
          this.storage.get('intolerances').then((val) => {
            if(val)
              this.medis4 = val;
            this.saveMIDATAMedications();
          });
        });
      }
    });
    actionSheet.addButton({
      text: 'Blutzucker',
      icon: 'water',
      handler: () => {
        // if storage is ready to use
        this.storage.ready().then(() => {
          this.storage.get('glucoseValues').then((val) => {
            if(val)
              this.glucose = val;
            this.saveMIDATAObservations({code:"15074-8"});
          });
        });
      }
    });
    actionSheet.addButton({
      text: 'Blutdruck',
      icon: 'heart',
      handler: () => {
        // if storage is ready to use
        this.storage.ready().then(() => {
          this.storage.get('bpValues').then((val) => {
            if(val)
              this.bp = val;
            this.saveMIDATAObservations({code:"55417-0"});
          });
        });
      }
    });
    actionSheet.addButton({
      text: 'Puls',
      icon: 'pulse',
      handler: () => {
        // if storage is ready to use
        this.storage.ready().then(() => {
          this.storage.get('pulseValues').then((val) => {
            if(val)
              this.pulse = val;
            this.saveMIDATAObservations({code:"8867-4"});
          });
        });
      }
    });
    actionSheet.addButton({
      text: 'Gewicht',
      icon: 'speedometer',
      handler: () => {
        // if storage is ready to use
        this.storage.ready().then(() => {
          this.storage.get('weightValues').then((val) => {
            if(val)
              this.weight = val;
            this.saveMIDATAObservations({code:"29463-7"});
          });
        });
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
   * save all medications from the midata account to storage
   */
  saveMIDATAMedications() {

    let m = this.mp.search("MedicationStatement");
    let fails = 0;
    let imports = 0;
    console.log(m);
    m.then((val) => {
      for(let i = 0; i < val.length; i++) {
        try {
          switch(val[i].note[0].text) {
            case "chronicMedis": {
              if(!this.checkMedication(val[i], this.medis1)) {
                this.medis1.push(val[i]);
                imports++;
              }
              break;
            }
            case "selfMedis": {
              if(!this.checkMedication(val[i], this.medis2)) {
                this.medis2.push(val[i]);
                imports++;
              }
              break;
            }
            case "insulin": {
              if(!this.checkMedication(val[i], this.medis3)) {
                this.medis3.push(val[i]);
                imports++;
              }
              break;
            }
            case "intolerances": {
              if(!this.checkMedication(val[i], this.medis4)) {
                this.medis4.push(val[i]);
                imports++;
              }
              break;
            }
            default: {
              fails++;
              break;
            }
          }
        } catch(Error) {
          fails++;
        }
      }
      // if storage is ready to use
      if(imports > 0) {
        this.storage.ready().then(() => {
          this.storage.set('chronicMedis', this.medis1);
          this.storage.set('selfMedis', this.medis2);
          this.storage.set('insulin', this.medis3);
          this.storage.set('intolerances', this.medis4);
        });
      }
      this.showImportAlert(val.length, imports, fails, 0, "Medikamente");
    });
  }

  /**
   * save all new resources of given type from MIDATA to storage
   * @param  {any} res type of resource in JSON |
   * Alle: {},
   * Glukose: {code:"15074-8"},
   * Puls: {code:"8867-4"},
   * Gewicht: {code:"29463-7"},
   * Blutdruck: {code:"55417-0"}
   */
  saveMIDATAObservations(res: any) {
    let fails = 0;
    let imports = 0;
    let others = 0;
    var o = this.mp.search("Observation", res);
    o.then((val) => {
      for(let i = 0; i < val.length; i++) {

        try {
          switch(val[i].code.coding[0].display) {

            case "Glucose [Moles/volume] in blood": {
              if(!this.checkGlucose(val[i], this.glucose)) {
                // create typ for glucose with date, value and event
                let g: TYPES.LOCAL_Glucose = {
                  date: new Date(val[i].effectiveDateTime),
                  value: parseFloat(val[i].valueQuantity.value),
                  event: val[i].comment
                };
                // save glucose in array
                this.glucose.push(g);
                imports++;
              }
              break;
            }
            case "Gewicht": {
              if(!this.checkWeight(val[i], this.weight)) {
                this.weight.push([new Date(val[i].effectiveDateTime).getTime(), val[i].valueQuantity.value]);
                imports++;
              }
              break;
            }
            case "Diastolischer Blutdruck": {
              this.bpDia.push([new Date(val[i].effectiveDateTime).getTime(), val[(i)].valueQuantity.value]);
              break;
            }
            case "Systolischer Blutdruck": {
              this.bpSys.push([new Date(val[i].effectiveDateTime).getTime(), val[(i)].valueQuantity.value]);
              break;
            }
            default: {
              others++;
              break;
            }
          }

        } catch(Error) {
          try {
            switch(val[i]._fhir.code.coding[0].display) {
              case "Blutdruck": {
                if(!this.checkBlutdruck(val[i]._fhir, this.bp)) {
                  this.bp.push([new Date(val[i]._fhir.effectiveDateTime).getTime(),
                                val[i]._fhir.component[1].valueQuantity.value,
                                val[i]._fhir.component[0].valueQuantity.value]);
                  imports++;
                }
                break;
              }
              case "Herzfrequenz": {
                if(!this.checkPulse(val[i]._fhir, this.pulse)) {
                  this.pulse.push([new Date(val[i]._fhir.effectiveDateTime).getTime(), val[i]._fhir.valueQuantity.value]);
                  imports++;
                }
                break;
              }
              case "Herzschlag": {
                if(!this.checkPulse(val[i]._fhir, this.pulse)) {
                  this.pulse.push([new Date(val[i]._fhir.effectiveDateTime).getTime(), val[i]._fhir.valueQuantity.value]);
                  imports++;
                }
                break;
              }
              case "Blood Pressure": {
                if(!this.checkBloodPressure(val[i]._fhir, this.bp)) {
                  this.bp.push([new Date(val[i]._fhir.effectiveDateTime).getTime(),
                                val[i]._fhir.component[0].valueQuantity.value,
                                val[i]._fhir.component[1].valueQuantity.value]);
                  imports++;
                }
                break;
              }
              case "Weight Measured": {
                if(!this.checkWeight(val[i]._fhir, this.weight)) {
                  this.weight.push([new Date(val[i]._fhir.effectiveDateTime).getTime(), val[i]._fhir.valueQuantity.value]);
                  imports++;
                }
                break;
              }
              case "Gewicht": {
                if(!this.checkWeight(val[i]._fhir, this.weight)) {
                  this.weight.push([new Date(val[i]._fhir.effectiveDateTime).getTime(), val[i]._fhir.valueQuantity.value]);
                  imports++;
                }
                break;
              }
              default: {
                others++;
                break;
              }
            }
          } catch(Error) {
            fails++;
          }
        }
      }
      // if storage is ready to use
      imports += this.getBloodPressure2(this.bpSys, this.bpDia);
      if(imports > 0) {
        this.storage.ready().then(() => {
          console.log(res.code);
          // save only the values with the code from the function mp.search() given params
          switch(res.code) {
            case "15074-8":
              this.storage.set('glucoseValues', this.glucose.sort(this.compareGlucoseValues));
              this.storage.set('changeTheMeasurementsView', true);
              break;
            case "8867-4":
              this.storage.set('pulseValues', this.pulse.sort());
              this.storage.set('changeTheMeasurementsView', true);
              break;
            case "29463-7":
              this.storage.set('weightValues', this.weight.sort());
              this.storage.set('changeTheMeasurementsView', true);
              break;
            case "55417-0":
              this.storage.set('bpValues', this.bp.sort());
              this.storage.set('changeTheMeasurementsView', true);
              break;
            default:
            this.storage.set('glucoseValues', this.glucose.sort(this.compareGlucoseValues));
            this.storage.set('pulseValues', this.pulse.sort());
            this.storage.set('bpValues', this.bp.sort());
            this.storage.set('weightValues', this.weight.sort());
            this.storage.set('changeTheMeasurementsView', true);
          }

        });
      }
      this.showImportAlert(val.length, imports, fails, others, "Messwerte");

    });
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
   * check if given medication already exist in given array
   * return true if exist, otherwise false
   * @param  {TYPES.LOCAL_MedicationStatementRes}        medi  medi to check
   * @param  {Array<TYPES.LOCAL_MedicationStatementRes>} medis array to proof
   * @return {boolean}                                         exist status
   */
  checkMedication(medi: TYPES.LOCAL_MedicationStatementRes, medis: Array<TYPES.LOCAL_MedicationStatementRes>):boolean {
    for(let i = 0; i < medis.length; i++) {
      if(medi.effectiveDateTime == medis[i].effectiveDateTime) {
        // if(medi.article.gtin == medis[i].article.gtin) {
          return true;
        // }
      }
    }
    return false;
  }

  /**
   * check if given glucose already exist in given array
   * return true if exist, otherwise false
   * @param  {TYPES.FHIR_ObservationRes_1Value} val  value to check
   * @param  {any}                              vals array to proof
   * @return {boolean}                                exist status
   */
  checkGlucose(val: TYPES.FHIR_ObservationRes_1Value, vals: any): boolean {
    for(let i = 0; i < vals.length; i++) {
      if(val.valueQuantity.value == vals[i].value) {
        if(new Date(val.effectiveDateTime).getTime() == vals[i].date.getTime()) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * check if given blood presure already exist in given array
   * return true if exist, otherwise false
   * @param  {TYPES.FHIR_ObservationRes_2Value} val  value to check
   * @param  {any}                              vals array to proof
   * @return {boolean}                                exist status
   */
  checkBloodPressure(val: TYPES.FHIR_ObservationRes_2Value, vals: any): boolean {
    for(let i = 0; i < vals.length; i++) {
      if(val.component[0].valueQuantity.value == vals[i][1]) {
        if(val.component[1].valueQuantity.value == vals[i][2]) {
          if(new Date(val.effectiveDateTime).getTime() == vals[i][0]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * check if given blood presure already exist in given array
   * return true if exist, otherwise false
   * @param  {TYPES.FHIR_ObservationRes_2Value} val  value to check
   * @param  {any}                              vals array to proof
   * @return {boolean}                                exist status
   */
  checkBlutdruck(val: TYPES.FHIR_ObservationRes_2Value, vals: any): boolean {
    for(let i = 0; i < vals.length; i++) {
      if(val.component[0].valueQuantity.value == vals[i][2]) {
        if(val.component[1].valueQuantity.value == vals[i][1]) {
          if(new Date(val.effectiveDateTime).getTime() == vals[i][0]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * get number of blood pressure values which not already exist
   * @param  {any}    valSys array with systolic values
   * @param  {any}    valDia array with diastolic values
   * @return {number}        count of successful imported values
   */
  getBloodPressure2(valSys: any, valDia: any): number {
    let count = 0;
    for(let i = 0; i < valSys.length; i++) {
      for(let y = 0; y < valDia.length; y++) {
        if(valSys[i][0] == valDia[y][0]) {
          if(!this.checkBloodPressure2(valSys[i][0], valSys[i][1], valDia[y][1], this.bp)) {
            this.bp.push([valSys[i][0], valSys[i][1], valDia[y][1]]);
            count = count + 2;
            console.log("bp2 ---------")
            console.log(count);
          }
        }
      }
    }
    return count;
  }

  /**
   * check if given blood presure already exist in given array
   * method is used for handling seperate resorces for systolic and diastolic bp
   * return true if exist, otherwise false
   * @param  {any} date   date
   * @param  {any} valSys systolic
   * @param  {any} valDia diastolic
   * @param  {any} vals   array
   * @return {boolean}        exist status
   */
  checkBloodPressure2(date: any, valSys: any, valDia: any, vals: any): boolean {
    for(let i = 0; i < vals.length; i++) {
      if(valSys == vals[i][1]) {
        if(valDia == vals[i][2]) {
          if(date == vals[i][0]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * check if given pulse already exist in given array
   * return true if exist, otherwise false
   * @param  {TYPES.FHIR_ObservationRes_1Value} val  value to check
   * @param  {any}                              vals array to proof
   * @return {boolean}                               exist status
   */
  checkPulse(val: TYPES.FHIR_ObservationRes_1Value, vals: any): boolean {
    for(let i = 0; i < vals.length; i++) {
      if(val.valueQuantity.value == vals[i][1]) {
        if(new Date(val.effectiveDateTime).getTime() == vals[i][0]) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * check if given weight already exist in given array
   * return true if exist, otherwise false
   * @param  {TYPES.FHIR_ObservationRes_1Value} val  value to check
   * @param  {any}                              vals array to proof
   * @return {boolean}                               exist status
   */
  checkWeight(val: TYPES.FHIR_ObservationRes_1Value, vals: any): boolean {
    for(let i = 0; i < vals.length; i++) {
      if(val.valueQuantity.value == vals[i][1]) {
        if(new Date(val.effectiveDateTime).getTime() == vals[i][0]) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * open an alert  to confirm the deletion of the storage. after the confirm, the storage will be cleared
   */
  deleteAllData() {
    //Alert to confirm the deletion of the data
    let confirm = this.alertCtrl.create({
      title: 'Alle Daten löschen?',
      message: 'Wollen Sie wirklich alle Daten unwiderruflich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Löschen',
          //After the confirmation, the storage will
          //be cleared and the user is logged out
          handler: () => {
            this.storage.ready().then(() => {
              this.storage.clear();
              localStorage.clear();
            });
            this.logout();
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * log out and navigate to the LoginPage
   */
  logout() {
    this.mp.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  /**
   * show an alert with the given information about a data import from MIDATA
   * @param  {number} all     all values imported
   * @param  {number} imports successful imported
   * @param  {number} fails   faild imported
   * @param  {number} others  not necessary resources
   * @param  {string} title   title of import
   */
  showImportAlert(all: number, imports: number, fails: number, others: number, title: string) {
    let message = this.getMessageRepresentation(all, imports, fails, others);
    let confirm = this.alertCtrl.create({
      title: 'Import '+title+' abgeschlossen',
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => { }
        }
      ]
    });
    confirm.present();
  }

  /**
   * get an alert message for a data import
   * @param  {number} all     all values imported
   * @param  {number} imports successful imported
   * @param  {number} fails   faild imported
   * @param  {number} others  not necessary resources
   * @param  {string} title   title of import
   */
  getMessageRepresentation(all: number, imports: number, fails: number, others: number): string {
    let message = "";
    if(all == 0) {
      message = "Es sind keine Ressourcen auf dem MIDATA-Account gespeichert.";
    }
    else if(all == 1) {
      message = "Von einer verfügbaren Ressource ";
      if(imports == 0) {
        message += "ist keine importiert worden. ";
        if(fails == 0) {
          message += "Die Ressource ist bereits vorhanden.";
        }
        else if(fails == 1) {
          message += "Die Ressource ist fehlerhaft.";
        }
      }
      else if(imports == 1) {
        message += "ist 1 importiert worden."
      }
    }
    else {
      message = "Von "+all+" verfügbaren Ressourcen ";
      if(imports == 0) {
        message += "ist keine importiert worden. ";
      }
      else if(imports == 1) {
        message += "ist 1 importiert worden. "
      }
      else {
        message += "sind "+imports+" importiert worden. ";
      }

      if(fails == 1) {
        message += "Es ist 1 Ressource fehlerhaft und "+(all - fails - imports - others)+" bereits vorhanden. ";
      }
      else {
        message += "Es sind "+fails+" Ressourcen fehlerhaft und "+(all - fails - imports - others)+" bereits vorhanden. ";
      }

      message += "Nicht relevant: "+others;
    }
    return message;
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
      if (a.value == b.value) {
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
  checkValueGlucose(glucose: TYPES.LOCAL_Glucose): boolean {
    var match: boolean = false;
    for (var i = 0; i < this.glucose.length; i++) {
      if (this.compareGlucoseValues(glucose, this.glucose[i]) == 0) {
        match = true;
      }
    }
    return match;
  }

  /**
   * import measurements from bluetooth device with given id.
   * get number of saved values and open method getBluetoothValues()
   * @param  {string} id mac or uuid from bluetooth device
   */
  importFromDevice(id: string) {
    console.log("start import");
    var index: number = 0;
    var result = new Uint8Array(7);
    var dataLength = new Uint8Array(6);
    dataLength[0] = 0x80; // start
    dataLength[1] = 0x01; // size
    dataLength[2] = 0xFE; // size invert
    dataLength[3] = 0x00; // command
    dataLength[4] = 0x81; // checksum low
    dataLength[5] = 0xFE; // checksum high

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
    // for all measurements
    for (var i = 0; i < num; i++) {
      dataValues[(0 + (i * 7))] = 0x80; // start
      dataValues[(1 + (i * 7))] = 0x02; // size
      dataValues[(2 + (i * 7))] = 0xFD; // size invert
      dataValues[(3 + (i * 7))] = 0x01; // comand
      dataValues[(4 + (i * 7))] = i;    // data (number of value)
      dataValues[(5 + (i * 7))] = (((0x80 ^ 0xFD) ^ i) ^ 0xFF); // checksum low
      dataValues[(6 + (i * 7))] = 0xFC; // checksum high
    }

    this.bls.write(dataValues).then(() => {
    });

    this.bls.subscribeRawData().subscribe((subs) => {
      var a = new Uint8Array(subs);
      // for every recived value save it
      for (var i = 0; i < a.length; i++) {
        result[byteRead] = a[i];
        byteRead++;
      }

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
   * add new glucose values to chart and midata with given array
   * the array contains valuesets from device myglucohealth
   * method: getBluetoothValues()
   * @param  {Uint8Array} array uint8 array with valuesets of glucose
   */
  addGlucoseValues(array: Uint8Array) {
    let gluco: TYPES.LOCAL_Glucose;
    let num = array.length / 6;
    let imports = 0;

    for (var i = 0; i < num; i++) {

      let glucoRep = this.getGlucoseRepresentation(array[(i * 6)],
                                                    array[((i * 6) + 1)],
                                                    array[((i * 6) + 2)],
                                                    array[((i * 6) + 3)],
                                                    array[((i * 6) + 4)],
                                                    array[((i * 6) + 5)]);

      let val: number = parseFloat(glucoRep.value);
      let date: Date = glucoRep.date;
      let event: string = glucoRep.event;
      gluco = {
        date: date,
        value: val,
        event: event
      }

      if (this.checkValueGlucose(gluco)) {
        console.log("Value already exist");
      } else {
        imports++;
        this.glucose.push(gluco);
        this.saveMIDATAGlucose(val, date, event);
        console.log("Added new Value");
      }
    }
    this.showImportAlert(num, imports, 0, 0, "MyGlucoHealth");

    this.storage.ready().then(() => {
      this.storage.set('glucoseValues', this.glucose.sort(this.compareGlucoseValues));
      this.storage.set('changeTheMeasurementsView', true);
    });
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
    // match the event typ with description
    if (event == 2) {
      event = "Nach dem Sport";
    } else if (event == 4) {
      event = "Nach Medikation";
    } else if (event == 8) {
      event = "Nach dem Essen";
    } else if (event == 16) {
      event = "Vor dem Essen";
    }
    // crate the result to return with params
    result = {
      value: ((((byte3 & 0x03) << 8) + byte4) / 18).toFixed(1),
      date: new Date( ((byte1 >> 1) + 2000), // year (after 2000 => 20017 = 17)
                    (((byte1 & 0x01) << 3) + (byte2 >> 5) - 1), // month (begin by 0)
                    (byte2 & 0x1f), // day
                    (((byte5 & 0x07) << 2) + (byte6 >> 6)), // hour
                    (byte6 & 0x3f)), // minute
      event: event
    }
    return result;
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
