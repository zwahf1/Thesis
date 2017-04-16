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

  arrayCheckups: [[string]];
  arrayControls: [[string]];

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
    });
  }

  openEntryCheckup() {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Neue Kontrolluntersuchung einfügen');

    alert.addInput({
      type: 'text',
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
            this.arrayCheckups.push([data.date, data.hba1c, data.bp, data.weight, data.hypo]);
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
