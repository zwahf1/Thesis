import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Checkups page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-checkups',
  templateUrl: 'checkups.html'
})
export class CheckupsPage {

  arrayCheckups: [[any]];
  arrayControls: [[any]];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.storage.ready().then(() => {

      this.storage.get('arrayCheckups').then((val) => {
        if(val == undefined) {
          console.log("undefined values");
          this.arrayCheckups = [[""]];
        } else {
          console.log("defined values");
          this.arrayCheckups = val;
        }
      });

      this.storage.get('arrayControls').then((val) => {
        if(val == undefined) {
          console.log("undefined values");
          this.arrayControls = [[false,"Hautbild","",""],
                                [true,"Sensibilität","",""],
                                [false,"Durchblutung","",""],
                                [false,"Deformitäten","",""],
                                [false,"Schuhe","",""],
                                [false,"Serumkreatinin","",""],
                                [false,"Mikroalbuminurie","",""],
                                [false,"TC/HDL","",""],
                                [true,"LDL","",""],
                                [false,"Triglyceride","",""],
                                [false,"Retinopathie","",""],
                                [false,"Tabak","",""],
                                [false,"Bewegung","",""]];
          this.storage.set('arrayControls',this.arrayControls);
        } else {
          console.log("defined values");
          this.arrayControls = val;
        }
      });
    });
  }

  clickCheckBox(control) {
    if(!control[0]) {
      this.openClearAlert(control);

    } else {

      this.openEntryNote(control);
    }

    this.storage.ready().then(() => {
      this.storage.set('arrayControls',this.arrayControls);
    });
  }

  openClearAlert(control) {
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
        // user has clicked the new medication button
        // begin the alert's dismiss transition
        let navTransition = alert.dismiss();
        control[0] = false;
        control[2] = "";
        control[3] = "";
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }

  openEntryNote(control) {
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
      handler: () => {
        control[0] = false;
      }
    });
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      handler: (data) => {
        // user has clicked the new medication button
        // begin the alert's dismiss transition
        let navTransition = alert.dismiss();
        control[0] = true;
        control[2] = ""+ new Date();
        control[3] = data.note;
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }

  openEntryCheckup() {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Neue Kontrolluntersuchung einfügen');

    alert.addInput({
      type: 'date',
      name: 'date',
      placeholder: 'Datum'
    });
    alert.addInput({
      type: 'number',
      name: 'hba1c',
      placeholder: 'HbA1c-Wert'
    });
    alert.addInput({
      type: 'number',
      name: 'bp',
      placeholder: 'Blutdruck-Wert'
    });
    alert.addInput({
      type: 'number',
      name: 'weight',
      placeholder: 'Gewicht'
    });
    alert.addInput({
      type: 'number',
      name: 'hypo',
      placeholder: 'Anzahl Hypoglykämien'
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
            this.arrayCheckups.push([new Date(), data.hba1c, data.bp, data.weight, data.hypo]);
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
