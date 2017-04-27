import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

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

  devices = [];

  constructor(public navCtrl: NavController, public bls: BluetoothSerial, public storage: Storage,
              public alertCtrl: AlertController) {

    this.storage.ready().then(() => {
      this.storage.get('deviceId').then((val) => {
        if(val) {
          this.devices = val;
        }
      });
    });
  }

  registerNewDevice() {
    this.bls.list().then((val) => {
      this.devices = val;
      if(this.devices.length == 0) {
        let alert = this.alertCtrl.create({
          title: 'Keine Geräte gefunden',
          subTitle: 'Bitte stellen Sie sicher, dass Bluetooth auf dem Smartphone eingeschaltet und unter "gekoppelte Geräte" das Messgerät sichtbar ist',
          buttons: ['OK']
        });
        alert.present();
      } else {
        this.storage.ready().then(() => {
          this.storage.set('deviceId',this.devices);
        });
      }

    });
  }

}
