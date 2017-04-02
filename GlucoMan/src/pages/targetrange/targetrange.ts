import { Component } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
import { App, NavController, AlertController  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-targetrange',
  templateUrl: 'targetrange.html'
})
export class TargetrangePage {

  dateGlucose: any;
  dateBloodPressure: any;
  dateWeight: any;
  dateHb: any;
  glucoseRange: any;
  vitalRangeList: VitalRange[];// = [new VitalRange('Diastolischer BD', 70,89, new Date)];

  constructor(public navCtrl: NavController,public storage: Storage, public appCtrl: App, private alertCtrl: AlertController) {
  this.vitalRangeList = [new VitalRange('Glukose', 3.6, 7.7, 'mmol/L', new Date, 'true'), new VitalRange('Diastolischer BD', 70,89, 'mmHg', new Date, 'true')];
  this.vitalRangeList.push(new VitalRange('Systolischer BD', 100, 139, 'mmHg', new Date, true));
  this.vitalRangeList.push(new VitalRange('Gewicht',75, 85, 'kg', new Date, true));
  this.vitalRangeList.push(new VitalRange('HbA1C', 4.5, 7.5, '%', new Date, true));

    this.storage.ready().then(() => {
      this.storage.set('VitalRangeList', this.vitalRangeList);
    });

  }
  inputChange(element) {
    console.log(element);
    element.parentElement.parentElement.style.background =  'whitesmoke';
    var d = new Date;
    var row = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    switch (row) {
      case 'glucoseRow':
    //    this.vitalRangeList.glucose.setDate = d;
        break;
      case 'bloodpressureRow':
        this.dateBloodPressure = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        break;
      case 'weightRow':
        this.dateWeight = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        break;
      case 'hbRow':
        this.dateHb = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        break;
    }
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

}
