import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { ContactsPage } from '../contacts/contacts';
import { SettingsPage } from '../settings/settings';
import { InformationPage } from '../information/information';
import { EmergencyPage } from '../emergency/emergency';
import { MeasureplanPage } from '../measureplan/measureplan';
import { CheckupsPage } from '../checkups/checkups';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //page: {title: string, component: any};


  constructor(public navCtrl: NavController, public appCtrl: App) {


  }


  goTo(target) {
    console.log(''+target);
    switch(target){
      case 'Settings':
        this.navCtrl.push(SettingsPage);
        break;
      case 'Contacts':
        this.navCtrl.push(ContactsPage);
        break;
      case 'Emergency':
        this.navCtrl.push(EmergencyPage);
        break;
      case 'Information':
        this.navCtrl.push(InformationPage);
        break;
      case 'Measureplan':
        this.navCtrl.push(MeasureplanPage);
        break;
      case 'Checkups':
        this.navCtrl.push(CheckupsPage);
        break;
    }
  }
}
