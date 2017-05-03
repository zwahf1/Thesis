import { Component } from '@angular/core';
import { App, PopoverController, AlertController } from 'ionic-angular';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';

/**
 * data page for settings page
 * @param  {'page-data'}  {selector   [description]
 * @param  {'data.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  private mp = MidataPersistence.getInstance();

  /**
   *
   * @param  {App}               publicappCtrl     handle root page
   * @param  {PopoverController} publicpopoverCtrl handle popovers
   * @param  {AlertController}   publicalertCtrl   handle alerts
   * @param  {Storage}           publicstorage     ionic storage from phone
   */
  constructor(public appCtrl: App, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public storage: Storage) { }

  /**
   * create popover to present the DisclaimerPage
   */
  presentPopover() {
    let popover = this.popoverCtrl.create(DisclaimerPage);
    popover.present();
  }

  /**
   * open an alert  to confirm the deletion of the storage. after the confirm, the storage will be cleared
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
   */
  logout() {
    this.mp.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }
}
