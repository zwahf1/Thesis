import { Component } from '@angular/core';

import { App, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { MidataPersistence } from '../../util/midataPersistence';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private mp = MidataPersistence.getInstance();

  constructor(public navCtrl: NavController, public appCtrl: App) {

  }

  logout() {
    this.mp.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

}
