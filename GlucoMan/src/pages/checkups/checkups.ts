import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * checkups page for home page
 * @param  {'page-checkups'}  {selector   [description]
 * @param  {'checkups.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-checkups',
  templateUrl: 'checkups.html'
})
export class CheckupsPage {

  arrayCheckups = [];
  arrayControls = [];

  /**
   * get all checkups and controls from storage and save it local.
   * if nothing is saved, define it (empty)
   * @param  {Storage}         publicstorage   ionic storage from phone
   * @param  {AlertController} publicalertCtrl handle alerts
   */
  constructor(public storage: Storage, public alertCtrl: AlertController) {
    this.storage.ready().then(() => {

      this.storage.get('arrayCheckups').then((val) => {
        if(val == undefined) {
          this.arrayCheckups = [];
        } else {
          this.arrayCheckups = val;
        }
      });

      this.storage.get('arrayControls').then((val) => {
        if(val == undefined) {
          this.arrayControls = [[false,"Hautbild","",""],
                                [false,"Sensibilität","",""],
                                [false,"Durchblutung","",""],
                                [false,"Deformitäten","",""],
                                [false,"Schuhe","",""],
                                [false,"Serumkreatinin","",""],
                                [false,"Mikroalbumin-urie","",""],
                                [false,"TC/HDL","",""],
                                [false,"LDL","",""],
                                [false,"Triglyceride","",""],
                                [false,"Retinopathie","",""],
                                [false,"Tabak","",""],
                                [false,"Bewegung","",""]];
          this.storage.set('arrayControls',this.arrayControls);
        } else {
          this.arrayControls = val;
        }
      });
    });
  }

  /**
   * if the checkbox of the givencontrol is clicked
   * @param  {any}    control clicked control
   */
  clickCheckBox(control: any) {
    if(!control[0]) {
      this.openClearControlAlert(control);

    } else {

      this.openEntryNote(control);
    }
  }

  /**
   * open an alert if you want to delete the given control
   * @param  {any}    control control to delete
   */
  openClearControlAlert(control: any) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Löschen');
    alert.setMessage('Wollen sie den Eintrag wirklich löschen?');
    // button to cancel
    alert.addButton({
      text: 'Cancel',
      handler: () => {
        control[0] = true;
      }
    });
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      handler: (data) => {
        control[0] = false;
        control[2] = "";
        control[3] = "";

        this.storage.ready().then(() => {
          this.storage.set('arrayControls',this.arrayControls);
        });
      }
    });
    // present the alert popup
    alert.present();
  }

  /**
   * open an alert if you want to delete the given checkup from list
   * @param  {any}    checkup checkup to delete
   */
  openClearCheckupsAlert(checkup: any) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Löschen');
    alert.setMessage('Wollen sie den Eintrag wirklich löschen?');
    // button to cancel
    alert.addButton({
      text: 'Cancel',
      role: 'cancel'
    });
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      handler: (data) => {
        let index: number = this.arrayCheckups.indexOf(checkup);
        console.log(index);
        if (index != -1) {
          this.arrayCheckups.splice(index, 1);
        }
        this.storage.ready().then(() => {
          this.storage.set("arrayCheckups",this.arrayCheckups);
        });
      }
    });
    // present the alert popup
    alert.present();
  }

  /**
   * open an alert for enter a description to the given control
   * @param  {any}    control control to add description
   */
  openEntryNote(control: any) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Bemerkung hinzufügen');

    alert.addInput({
      type: 'text',
      name: 'note',
      placeholder: 'Bemerkung'
    });
    // button to cancel
    alert.addButton({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        control[0] = false;
      }
    });
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      handler: (data) => {
        control[0] = true;
        control[2] = ""+ new Date();
        control[3] = data.note;

        this.storage.ready().then(() => {
          this.storage.set('arrayControls',this.arrayControls);
        });
      }
    });
    // present the alert popup
    alert.present();
  }

  /**
   * open an alert to add a new checkup to the list
   */
  openEntryCheckup() {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Neue Kontrolluntersuchung');

    alert.addInput({
      type: 'date',
      name: 'date',
      placeholder: 'Datum'
    });
    alert.addInput({
      type: 'number',
      name: 'hba1c',
      placeholder: 'HbA1c-Wert in %'
    });
    alert.addInput({
      type: 'text',
      name: 'bp',
      placeholder: 'Blutdruck in mmHg (Sys / Dia)'
    });
    alert.addInput({
      type: 'number',
      name: 'weight',
      placeholder: 'Gewicht in kg'
    });
    // button to cancel
    alert.addButton('Cancel');
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      handler: (data) => {
        // user has clicked the new medication button
        // begin the alert's dismiss transition
        let navTransition = alert.dismiss();
        // If stroage is ready to use
        this.storage.ready().then(() => {
          // if the category is choosed
          navTransition.then(() => {
            console.log(data);
            this.arrayCheckups.push([data.date, data.hba1c, data.bp, data.weight]);
            this.storage.set('arrayCheckups',this.arrayCheckups);
          });
        });
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }
}
