import { Component } from '@angular/core';
import { App, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';

/*****************************************************************************
DataPage - listet in the settings menu.
It includes the disclaimer information and the option to clear the storage.
*****************************************************************************/
@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  private mp = MidataPersistence.getInstance();

  constructor(public navCtrl: NavController, public appCtrl: App, public navParams: NavParams, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public storage: Storage) { }

  /**
   * PopoverController to present the DisclaimerPage
   *  @return {[type]} [description]
   */
  presentPopover() {
    let popover = this.popoverCtrl.create(DisclaimerPage);
    popover.present();
  }
  /**
   * an alet is presented to confirm the deletion of the storage. after the confirm, the storage wil lbe cleared
   * @return {[type]} [description]
   */
  deleteAllData() {
    //Alert to confirm the deletion of the data
    let confirm = this.alertCtrl.create({
      title: 'Alle Daten löschen?',
      message: 'Wollen Sie wirklich alle Daten unwiderruflich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Löschen',
          //After the confirmation, the storage will
          //be cleared and the user is logged out
          handler: () => {
            this.storage.ready().then(() => {
              this.storage.clear();
              localStorage.clear();
            });
            this.logout();
          }
        }
      ]
    });
    confirm.present();
  }
  /**
   * log out and navigate to the LoginPage
   * @return {[type]} [description]
   */
  logout() {
    this.mp.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }
}
