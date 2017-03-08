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

  constructor(public platform: Platform, public navController: NavController,
     public storage: Storage) {

  }

  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        this.storage.set('valueBarcodeMedication', result.text);
      });
    });
  }
}
