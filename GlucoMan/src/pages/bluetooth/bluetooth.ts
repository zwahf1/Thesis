import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
/**
 * bluetooth page for settings
 * @param  {'page-bluetooth'}  {selector   [description]
 * @param  {'bluetooth.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})

export class BluetoothPage {

  devices = [];
  /**
   * create the bluetooth page and get registered devices from storage and save it local
   * @param  {BluetoothSerial} publicbls       connection to device
   * @param  {Storage}         publicstorage   ionic storage from phone
   * @param  {AlertController} publicalertCtrl handle alerts
   */
  constructor(public bls: BluetoothSerial, public storage: Storage,
              public alertCtrl: AlertController) {

    this.storage.ready().then(() => {
      this.storage.get('deviceId').then((val) => {
        if(val) {
          this.devices = val;
        }
      });
    });
  }

  /**
   * register new bluetooth devices for import measurements
   */
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
