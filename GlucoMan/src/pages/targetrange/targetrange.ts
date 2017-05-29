import { Component } from '@angular/core';
import { VitalRange } from '../../util/VitalRange';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * target range page for settings page
 * @param  {'page-targetrange'}  {selector   [description]
 * @param  {'targetrange.html'}} templateUrl [description]
 */
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
  changeFlag = false;

  /**
   * loads default values as target range. if there's a value in the storage,
   * the default will be overwritten.
   * @param  {Storage}         publicstorage    ionic storage from phone
   * @param  {AlertController} publicalertCtrl  handle alerts
   */
  constructor(public storage: Storage, public alertCtrl: AlertController) {
    // this.vitalRangeList.push(new VitalRange('Glukose', 3.6, 7.7, 'mmol/L', new Date));
    // this.vitalRangeList.push(new VitalRange('Systolischer BD', 100, 139, 'mmHg', new Date));
    // this.vitalRangeList.push(new VitalRange('Diastolischer BD', 70, 89, 'mmHg', new Date));
    // this.vitalRangeList.push(new VitalRange('Puls', 0, 0, '/min', new Date));
    // this.vitalRangeList.push(new VitalRange('Gewicht', 65, 85, 'kg', new Date));
    this.vitalRangeList.push(new VitalRange('Glukose', 0, 0, 'mmol/L', new Date));
    this.vitalRangeList.push(new VitalRange('Systolischer BD', 0, 0, 'mmHg', new Date));
    this.vitalRangeList.push(new VitalRange('Diastolischer BD', 0, 0, 'mmHg', new Date));
    this.vitalRangeList.push(new VitalRange('Puls', 0, 0, '/min', new Date));
    this.vitalRangeList.push(new VitalRange('Gewicht', 0, 0, 'kg', new Date));

    this.storage.ready().then(() => {
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        }
      })
    });
  }

  /**
  * loads the latest vitalRangeList from the storage when page is loaded
  **/
  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('VitalRangeList').then((val) => {
        if (val) {
          this.vitalRangeList = val;
        }
      })
    });
  }

  /**
  * after an input changed, this number field has the color 'whitesmoke'
  * @param  {any}    item target range item
  */
  inputChange(item: any) {
    this.changeFlag = true;
    item.changeFlag = true;
    var d = new Date;
    item.date = d;
  }

  /**
  * back method for the customized back navigate.
  * it calls the confirm alert to save the data, if the changeFlag is true,
  * before the navCtrl pops the current view.
  */
  ionViewWillLeave() {
    if (this.changeFlag) {
      this.presentConfirm();
    }
  }

  /**
  * method to confirm and save the edited values.
  */
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Speichern',
      message: 'Wollen Sie die geänderten Werten speichern?',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Speichern',
          handler: () => {
            this.storage.ready().then(() => {
              this.storage.set('changeTheMeasurementsView', true);
              this.storage.set('VitalRangeList', this.vitalRangeList);
              this.changeFlag = false;
              this.vitalRangeList.forEach((obj) => {
                obj.changeFlag = false;
              });
            });
          }
        }
      ]
    });
    alert.present();
  }
}
