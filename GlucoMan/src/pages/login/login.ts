import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NavController, AlertController } from 'ionic-angular';

import { TabsPage} from '../tabs/tabs';

import { MidataPersistence } from '../../util/midataPersistence';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private mp = MidataPersistence.getInstance();
  private username: string;
  private password: string;

  private input = {username: 'mia.egger@mail.com', password : 'PW4mia17'};

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    if(this.mp.loggedIn()) {
      console.log("Logged in");
      this.navCtrl.setRoot(TabsPage);
    } else {
      console.log("Logged out");
    }
  }

  login() {
    this.mp.login(this.input.username, this.input.password).then((res) => {
      if(this.mp.loggedIn() == true){
        this.navCtrl.setRoot(TabsPage);
      }
    }).catch((ex) => {
    console.error('Error fetching users', ex);
    let alert = this.alertCtrl.create({
      title: 'false login',
      subTitle: 'the entered username or password is incorrect',
      buttons: ['OK']
    });
    alert.present();
});;
  }
  
  backdoor() {
    this.navCtrl.setRoot(TabsPage)
  }

}
