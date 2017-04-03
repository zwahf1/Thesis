import { Component } from '@angular/core';
import { App, NavController, AlertController  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TargetrangePage } from '../targetrange/targetrange';
import { DisplayPage } from '../display/display';
import { DataPage } from '../data/data';
import { MIDATAPage } from '../midata/midata';

import { MidataPersistence } from '../../util/midataPersistence';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private mp = MidataPersistence.getInstance();

  constructor(public navCtrl: NavController, public appCtrl: App, private alertCtrl: AlertController) {

  }
  goTo(target) {
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
      case 'MIDATAPage':
        this.navCtrl.push(MIDATAPage);
        break;
    }
  }
  logout() {
    this.mp.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

}
