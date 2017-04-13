import { Component } from '@angular/core';
import { App, NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {

  glucoseUnit = 'mmol/L';
  visibleList = [];


  constructor(public navCtrl: NavController, public appCtrl: App, public storage: Storage, public loadingCtrl: LoadingController) {
    this.visibleList['all'] = true;
    this.visibleList['glucose'] = true;
    this.visibleList['bloodpressure'] = true;
    this.visibleList['pulse'] = true;
    this.visibleList['weight'] = true;

    this.storage.ready().then(() => {
      this.storage.get('VisibleList').then((val) => {
        if (val) {
          this.visibleList = val;
        }
      })
      this.storage.get('GlucoseUnit').then((val) => {
        if (val) {
          this.glucoseUnit = val;
        }
      })
    });
  }

  ionViewDidEnter() {
    /*
    let loading = this.loadingCtrl.create();
    loading.present();
    loading.dismiss();
    */
  }

  visibleChange() {
    this.storage.ready().then(() => {
      this.storage.set('VisibleList', this.visibleList);
    });
  }
  unitChange(unit) {
    console.log(unit);
    this.glucoseUnit = unit;
    console.log(this.glucoseUnit);
    this.storage.ready().then(() => {
      this.storage.set('GlucoseUnit', this.glucoseUnit);
    });
  }

}
