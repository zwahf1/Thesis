import { Component } from '@angular/core';
import { NavController, AlertController, PopoverController } from 'ionic-angular';
import { TabsPage} from '../tabs/tabs';
import { MidataPersistence } from '../../util/midataPersistence';
import { DisclaimerPage } from '../disclaimer/disclaimer';
import { Storage } from '@ionic/storage';

declare var cordova: any;

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

  // demozwecke
  // username: mia.egger@mail.com
  // password: PW4mia17
  private input = { username: '', password: '' };

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
        if (val != undefined) {
          console.log("Logged in");
          // login to the saved account
          this.mp.login(val[0], val[1]).then(() => {
            this.navCtrl.popToRoot();
            this.navCtrl.setRoot(TabsPage);
          }).catch(() => {
            this.input.username = val[0];
            this.input.password = val[1];
            let alert = this.alertCtrl.create({
              title: 'Login nicht möglich',
              subTitle: 'Es besteht keine Internetverbindung!',
              buttons: ['OK']
            });
            alert.present();
          });
          // set the start page to tabs (if logged in)
        } else {
          // normal login page
          console.log("Logged out");
        }
      });
    });
  }

  /**
   * Hide the keyboard and present the popover with the disclaimer page
   */
  presentPopover() {
    cordova.plugins.Keyboard.close();
    setTimeout(() => {
      let popover = this.popoverCtrl.create(DisclaimerPage);
      popover.present();
    }, 100);
  }

  /**
   * login to midata account and show tabs page, if correct username and password.
   * otherwise show alert to reenter credentials
   */
  login() {
    this.mp.login(this.input.username, this.input.password).then((res) => {
      if (this.mp.loggedIn() == true) {
        this.storage.ready().then(() => {
          this.storage.set('UserAuthentication', [this.input.username, this.input.password, res]);
        });
        this.navCtrl.popToRoot();
        this.navCtrl.setRoot(TabsPage);
      }
    }).catch((ex) => {
      console.error('Error fetching users', ex);
      let alert = this.alertCtrl.create({
        title: 'Login nicht möglich',
        subTitle: 'Username / Passwort ist nicht korrekt oder es besteht keine Internetverbindung!',
        buttons: ['OK']
      });
      alert.present();
    });
  }
}
