import { Component } from '@angular/core';
//import { Http } from '@anguar/http';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova: any;
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html'
})
export class NutritionPage {
  resultBarcode: any;

  /*  static get parameters(){
      return [[Http]];
    }
    */
  constructor(public navCtrl: NavController, public platform: Platform,
    public storage: Storage) {

  }

  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        this.storage.set('valueBarcodeNutrition', result.text);
      });
    });
  }
}
