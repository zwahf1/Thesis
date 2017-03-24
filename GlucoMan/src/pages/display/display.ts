import { Component } from '@angular/core';
import { App, NavController, AlertController  } from 'ionic-angular';
import { LoginPage } from '../login/login';


import { ContactsPage } from '../contacts/contacts';
import { MidataPersistence } from '../../util/midataPersistence';

@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {

  private mp = MidataPersistence.getInstance();

  constructor(public navCtrl: NavController, public appCtrl: App, private alertCtrl: AlertController) {

  }



}
