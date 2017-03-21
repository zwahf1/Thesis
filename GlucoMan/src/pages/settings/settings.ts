import { Component } from '@angular/core';
import { App,NavController, AlertController  } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { MidataPersistence } from '../../util/midataPersistence';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
dateGlucose: any;
dateBloodPressure: any;
dateWeight: any;
dateHb: any;


  private mp = MidataPersistence.getInstance();

  constructor(public navCtrl: NavController, public appCtrl: App, private alertCtrl: AlertController) {

  }
  inputChange(element) {
    console.log(element);
    element.parentElement.parentElement.style.background = 'skyblue';
    var d = new Date;
    var row = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    switch(row){
      case 'glucoseRow':
        this.dateGlucose = d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
        break;
      case 'bloodpressureRow':
        this.dateBloodPressure = d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
        break;
      case 'weightRow':
        this.dateWeight = d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
        break;
      case 'hbRow':
        this.dateHb = d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
        break;
    }

//    element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("date").value = d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
//    console.log(element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
//    console.log(element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id);
//    console.log(element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("date"));

    //element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.td[6].value = Date.now();
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Speichern',
      message: 'Wollen Sie die geänderten Werten speichern?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('abgebrochen');
          }
        },
        {
          text: 'Speichern',
          handler: () => {
            console.log('gespeichert');
          }
        }
      ]
    });
    alert.present();
  }

  logout() {
    this.mp.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

}
