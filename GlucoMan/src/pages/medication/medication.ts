import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})
export class MedicationPage {
  resultFromBarcode: any;

  medis: [{title: string, dose: string}];

  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage) {
    this.medis = [{title: "Algifor", dose: "10mg"},{title: "Ibuprofen",dose: "2/Tag"}];
  }

  detailMedi(medi) {
    
  }

  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        this.storage.set('valueBarcodeMedication', result.text);
      });
    });
  }
}
