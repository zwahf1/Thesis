import { Component } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
import { App, NavController, AlertController  } from 'ionic-angular';
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
  vitalRangeList = [];

  constructor(public navCtrl: NavController, public storage: Storage, public appCtrl: App, private alertCtrl: AlertController) {
    this.vitalRangeList.push( new VitalRange('Glukose', 3.6, 7.7, 'mmol/L', new Date));
    this.vitalRangeList.push(new VitalRange('Diastolischer BD', 70, 89, 'mmHg', new Date));
    this.vitalRangeList.push( new VitalRange('Systolischer BD', 100, 139, 'mmHg', new Date));
    this.vitalRangeList.push(new VitalRange('Puls', 0, 0, '/min', new Date));
    this.vitalRangeList.push( new VitalRange('Gewicht', 65, 85, 'kg', new Date));

    this.storage.ready().then(() => {
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        }
      })
    });
  }
  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        }
      })
    });
  }
  inputChange(element, item) {

    element.parentElement.parentElement.style.background = 'whitesmoke';
    var d = new Date;
    item.date = d;
    console.log(this.vitalRangeList);
    console.log(item);
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
            this.storage.ready().then(() => {
              this.storage.set('VitalRangeList', this.vitalRangeList);
            });
            console.log('gespeichert');
          }
        }
      ]
    });
    alert.present();
  }

}
