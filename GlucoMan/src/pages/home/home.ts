import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ContactsPage } from '../contacts/contacts';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

import { PopoverController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  page: {title: string, component: any};

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
    
  }

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  openContacts() {
    this.navCtrl.push(ContactsPage);
  }

  presentLogin() {
    let popover = this.popoverCtrl.create(LoginPage);
    popover.present();
  }

}
