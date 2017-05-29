import { Component } from '@angular/core';
import { App, NavController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TargetrangePage } from '../targetrange/targetrange';
import { DisplayPage } from '../display/display';
import { DataPage } from '../data/data';
import { SchemaPage} from '../schema/schema';
import { BluetoothPage } from '../bluetooth/bluetooth';

import { MidataPersistence } from '../../util/midataPersistence';

import { Storage } from '@ionic/storage';
/**
 * settings page for Home page
 * @param  {'page-settings'}  {selector   [description]
 * @param  {'settings.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  private mp = MidataPersistence.getInstance();

  /**
   *
   * @param  {NavController} publicnavCtrl navigation of app
   * @param  {App}           publicappCtrl app
   * @param  {Storage}       publicstorage ionic storage from phone
   */
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public appCtrl: App, public storage: Storage) { }

  /**
   * method to navigate to the next page
   * @param  {string} target target Page of the navigation
   */
  goTo(target: string) {
    switch(target){
      case 'TargetrangePage':
        this.navCtrl.push(TargetrangePage);
        break;
      case 'DisplayPage':
        this.navCtrl.push(DisplayPage);
        break;
      case 'DataPage':
        this.navCtrl.push(DataPage);
        break;
      case 'SchemaPage':
        this.navCtrl.push(SchemaPage);
        break;
      case 'BluetoothPage':
        this.navCtrl.push(BluetoothPage);
        break;
    }
  }

  /**
  * method to log out from the midata account and navigate to the LoginPage
  **/
  logout() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Wollen sie sich wirklich ausloggen? Die gespeicherten Daten auf der App werden '+'alle gelöscht!'.bold()
    });
    alert.addButton('Nein');
    alert.addButton({
      text: 'Ja',
      handler: () => {
        this.storage.ready().then(() => {
          this.storage.clear();
          localStorage.clear();
        });
        this.mp.logout();
        this.appCtrl.getRootNav().setRoot(LoginPage);
      }
    });
    alert.present();

  }

}
