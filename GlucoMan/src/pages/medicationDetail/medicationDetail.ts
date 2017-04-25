import { Component } from '@angular/core';

import { NavController, AlertController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as TYPES from '../../util/typings/MIDATA_Types';

@Component({
  selector: 'page-medicationDetail',
  templateUrl: 'medicationDetail.html'
})

export class MedicationDetailPage {
  medication: TYPES.LOCAL_MedicationStatementRes;
  category: string;
  array: [TYPES.LOCAL_MedicationStatementRes];
/**************************************************
                  constructor

create the detail page for the given medication
***************************************************/
  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.medication = params.get('medi');
    this.array = params.get('array');
  }

  deleteMedi() {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Löschen');
    alert.setMessage('Wollen sie das Medikament wirklich löschen?');
    // button to cancel
    alert.addButton({
      text: 'Cancel',
      handler: () => {
      }
    });
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      handler: () => {
        // user has clicked the new medication button
        // begin the alert's dismiss transition
        let index: number = this.array.indexOf(this.medication);
        console.log(index);
        if (index != -1) {
          this.array.splice(index, 1);
        }
        this.storage.ready().then(() => {
          this.storage.set(this.medication.note[0].text,this.array);
        });
        this.navCtrl.pop();
      }
    });
    // present the alert popup
    alert.present();
  }

}
