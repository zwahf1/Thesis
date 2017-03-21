import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ContactsPage } from '../contacts/contacts';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  page: {title: string, component: any};

  constructor(public navCtrl: NavController) {

  }

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  openContacts() {
    this.navCtrl.push(ContactsPage);
  }

}
