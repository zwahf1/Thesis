import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { TabsPage} from '../tabs/tabs';

import { MidataPersistence } from '../../util/midataPersistence';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private mp = MidataPersistence.getInstance();

  constructor(public navCtrl: NavController) {
    if(this.mp.loggedIn()) {
      this.navCtrl.setRoot(TabsPage);
    } else {
      
    }
  }

}
