import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as TYPES from '../../util/typings/MIDATA_Types';

@Component({
  selector: 'page-medicationDetail',
  templateUrl: 'medicationDetail.html'
})

export class MedicationDetailPage {
  medication: TYPES.LOCAL_MedicationStatementRes;
  category: string;
/**************************************************
                  constructor

create the detail page for the given medication
***************************************************/
  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage) {
    this.medication = params.get('medi');
    this.category = params.get('category');
  }



  deleteMedi() {
    this.storage.ready().then(() => {
      this.storage.get(this.category).then((val) => {
        let values = val;
        let index: number = values.indexOf(this.medication);
        if (index !== -1) {
          values.splice(index, 1);
        }
        console.log(index);
        console.log(this.medication);
        console.log(val);
        console.log(values);
        this.storage.set(this.category,values);
        this.navCtrl.pop();
      });
    });

  }
}
