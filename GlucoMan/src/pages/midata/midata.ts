import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { MidataPersistence } from '../../util/midataPersistence';

/*
  Generated class for the MIDATA page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-midata',
  templateUrl: 'midata.html'
})
export class MIDATAPage {

    private mp = MidataPersistence.getInstance();
    private username: string;
    private password: string;
    private input = {username: 'mia.egger@mail.com', password : 'PW4mia17'};

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MIDATAPage');
  }

  login() {
    this.mp.login(this.input.username, this.input.password).then((res) => {
      if(this.mp.loggedIn() == true){
        this.navCtrl.pop();
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

}
