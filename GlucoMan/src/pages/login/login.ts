import { Component } from '@angular/core';
import { NavController, AlertController, PopoverController } from 'ionic-angular';
import { TabsPage} from '../tabs/tabs';
import { MidataPersistence } from '../../util/midataPersistence';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { Storage } from '@ionic/storage';

/**
 * login page for start page
 * @param  {'page-login'}  {selector   [description]
 * @param  {'login.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  private mp = MidataPersistence.getInstance();

  private input = {username: 'mia.egger@mail.com', password : 'PW4mia17'};

  /**
   * auto log in if user credentials are saved and show tabs page.
   * otherwise show login page
   * @param  {NavController}     publicnavCtrl     navigation of app
   * @param  {AlertController}   publicalertCtrl   handle alerts
   * @param  {Storage}           publicstorage     ionic storage from phone
   * @param  {PopoverController} publicpopoverCtrl handle popovers
   */
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

  /**
   * present the popover with the disclaimer page
   */
  presentPopover() {
    let popover = this.popoverCtrl.create(DisclaimerPage);
    popover.present();
  }

  /**
   * login to midata account and show tabs page, if correct username and password.
   * otherwise show alert to reenter credentials
   */
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
