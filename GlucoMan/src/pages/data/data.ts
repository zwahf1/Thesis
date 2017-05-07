import { Component } from '@angular/core';
import { App, PopoverController, AlertController, ActionSheetController } from 'ionic-angular';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as TYPES from '../../util/typings/MIDATA_Types';

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
    public storage: Storage, public actionSheetCtrl: ActionSheetController) {
      console.log("construct settings");
    }

  /**
   * create popover to present the DisclaimerPage
   */
  presentPopover() {
    let popover = this.popoverCtrl.create(DisclaimerPage);
    popover.present();
  }

  /**
   * open the action sheet to choose the import from MIDATA
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
            this.getMIDATAMedications();
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
            console.log(this.glucose);
            console.log(this.pulse);
            console.log(this.bp);
            console.log(this.weight);
            this.getMIDATAObservations();
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
            this.getMIDATAMedications();
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
            this.getMIDATAGlucose();
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
            this.getMIDATABloodPressure();
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
            this.getMIDATAPulse();
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
            this.getMIDATAWeight();
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
   * get all medications from the midata account
   */
  getMIDATAMedications() {

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
      this.storage.ready().then(() => {
        this.storage.set('chronicMedis', this.medis1);
        this.storage.set('selfMedis', this.medis2);
        this.storage.set('insulin', this.medis3);
        this.storage.set('intolerances', this.medis4);
      });
      this.showImportAlert(val.length, imports, fails, 0, "Medikamente");
    });
  }

  /**
   * get all observations from the midata account
   */
  getMIDATAObservations() {
    let fails = 0;
    let imports = 0;
    let others = 0;
    var o = this.mp.search("Observation");
    o.then((val) => {
      for(let i = 0; i < val.length; i++) {
        try {
          switch(val[i].code.coding[0].display) {

            case "Glucose [Moles/volume] in blood": {
              if(!this.checkGlucose(val[i], this.glucose)) {
                let g: TYPES.LOCAL_Glucose = {
                  date: new Date(val[i].effectiveDateTime),
                  value: parseFloat(val[i].valueQuantity.value),
                  event: "Nicht verfügbar"
                };
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
          switch(val[i]._fhir.code.coding[0].display) {
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
        }
      }
      // if storage is ready to use
      imports += this.getBloodPressure2(this.bpSys, this.bpDia);
      this.storage.ready().then(() => {
        this.storage.set('glucoseValues', this.glucose.sort(this.compareGlucoseValues));
        this.storage.set('pulseValues', this.pulse.sort());
        this.storage.set('bpValues', this.bp.sort());
        this.storage.set('weightValues', this.weight.sort());
        this.storage.set('changeTheMeasurementsView', true);
      });
      this.showImportAlert(val.length, imports, fails, others, "Messwerte");

    });
  }

  /**
   * get all weights of the logged in midata account
   */
  getMIDATAWeight() {

  }

  /**
   * get all pulses of the logged in midata account
   */
  getMIDATAPulse() {

  }

  /**
   * get all blood pressures of the logged in midata account
   */
  getMIDATABloodPressure() {

  }

  /**
   * get all glucoses of the logged in midata account
   */
  getMIDATAGlucose() {

  }


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

  checkGlucose(val: TYPES.FHIR_ObservationRes_1Value, vals) {
    for(let i = 0; i < vals.length; i++) {
      if(val.valueQuantity.value == vals[i].value) {
        if(new Date(val.effectiveDateTime).getTime() == vals[i].date.getTime()) {
          return true;
        }
      }
    }
    return false;
  }

  checkBloodPressure(val: TYPES.FHIR_ObservationRes_2Value, vals) {
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

  getBloodPressure2(valSys, valDia): number {
    let count = 0;
    for(let i = 0; i < valSys.length; i++) {
      for(let y = 0; y < valDia.length; y++) {
        if(valSys[i][0] == valDia[y][0]) {
          if(!this.checkBloodPressure2(valSys[i][0], valSys[i][1], valDia[y][1], this.bp)) {
            this.bp.push([valSys[i][0], valSys[i][1], valDia[y][1]]);
            count = count + 2;
          }
        }
      }
    }
    return count;
  }

  checkBloodPressure2(date, valSys, valDia, vals) {
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

  checkPulse(val: TYPES.FHIR_ObservationRes_1Value, vals) {
    for(let i = 0; i < vals.length; i++) {
      if(val.valueQuantity.value == vals[i][1]) {
        if(new Date(val.effectiveDateTime).getTime() == vals[i][0]) {
          return true;
        }
      }
    }
    return false;
  }

  checkWeight(val: TYPES.FHIR_ObservationRes_1Value, vals) {
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
        message += "ist eine importiert worden."
      }
    }
    else {
      message = "Von "+all+" verfügbaren Ressourcen ";
      if(imports == 0) {
        message += "ist keine importiert worden. ";
      }
      else if(imports == 1) {
        message += "ist eine importiert worden. "
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

      if(others == 1) {
        message += "Es ist 1 nicht relevante Ressource auf MIDATA gespeichert. ";
      }
      else {
        message += "Es sind "+others+" nicht relevante Ressourcen auf MIDATA gespeichert. ";
      }
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
}
