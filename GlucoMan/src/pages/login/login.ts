import { Component } from '@angular/core';
import { NavController, AlertController, PopoverController } from 'ionic-angular';
import { TabsPage} from '../tabs/tabs';
import { MidataPersistence } from '../../util/midataPersistence';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private mp = MidataPersistence.getInstance();

  private input = {username: 'mia.egger@mail.com', password : 'PW4mia17'};

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage,
                public popoverCtrl: PopoverController) {
    this.storage.ready().then(() => {
      // get login data from storage
      this.storage.get('UserAuthentication').then((val) => {
        // if some login data is stored
        if(val != undefined) {
          console.log("Logged in");
          // login to the saved account
          this.mp.login(val[0], val[1]);
          // set the start page to tabs (no login)
          this.navCtrl.setRoot(TabsPage);
        } else {
          // normal login page
          console.log("Logged out");
        }
      });
    });
  }
  //PopoverController to present the DisclaimerPage
  presentPopover() {
    let popover = this.popoverCtrl.create(DisclaimerPage);
    popover.present();
  }

  login() {
    this.mp.login(this.input.username, this.input.password).then((res) => {
      if(this.mp.loggedIn() == true){
        this.storage.ready().then(() => {
          this.storage.set('UserAuthentication', [this.input.username, this.input.password, res]);
        });
        this.navCtrl.popToRoot();
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
    });
  }
}
