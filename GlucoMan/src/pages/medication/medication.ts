import { Component } from '@angular/core';
import { Platform, AlertController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova: any;
declare var nav: any;
//declare var Alert: any;
@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})
export class MedicationPage {
  resultFromBarcode: any;
  static get parameters(){
    return [[Platform], [NavController]];
  }
  constructor(public platform: Platform,public navController: NavController, public alertCtrl: AlertController, public storage: Storage) {
    platform = platform;
    navController = navController;
    //this.resultFromBarcode = '1234';
  }

  scan(){
    this.platform.ready().then(() => {

      cordova.plugins.barcodeScanner.scan((result) =>
      {
        this.storage.set('valueBarcode', JSON.stringify(result.text));
      //  this.resultFromBarcode = result.text;
        nav.present(this.alertCtrl.create({
          title: "Scan Results",
          subTitle: result.text,
          buttons: ["Close"]
        }));
      }, (error) => {
        nav.present(this.alertCtrl.create({
          title: "Attention!",
          subTitle: error,
          buttons: ["Close"]
        }));
      }
    );

    });
  }

}
