import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
/*
  Generated class for the Bluetooth page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public bls: BluetoothSerial, public storage: Storage) {

  }

  registerNewDevice() {
    this.bls.list().then((val) => {
      if(val == undefined)
      // If stroage is ready to use
      this.storage.ready().then(() => {
        this.storage.set('deviceId',val);
        console.log(val);
      });

    });
  }

}
