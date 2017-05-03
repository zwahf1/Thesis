import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { InformationPage } from '../information/information';
import { EmergencyPage } from '../emergency/emergency';
import { MeasureplanPage } from '../measureplan/measureplan';
import { CheckupsPage } from '../checkups/checkups';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public actionCtrl: ActionSheetController, public storage: Storage) {
  }
  /**
   * [goTo description]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  goTo(target) {
    switch (target) {
      case 'Settings':
        this.navCtrl.push(SettingsPage);
        break;
      case 'Emergency':
        this.navCtrl.push(EmergencyPage);
        break;
      case 'Information':
        this.navCtrl.push(InformationPage);
        break;
      case 'Measureplan':
        this.navCtrl.push(MeasureplanPage);
        break;
      case 'Checkups':
        this.navCtrl.push(CheckupsPage);
        break;
    }
  }
  /**
   * open an action sheet to choose the vital sign for a new entry.
   * @return {[type]} [description]
   */
  openActionSheet() {
    let actionSheet = this.actionCtrl.create({});
    actionSheet.setTitle('Neuer Eintrag');
    actionSheet.addButton({
      text: 'Essen',
      icon: 'restaurant',
      handler: () => {
        // this.navCtrl.setRoot(NutritionPage, 'nutrition
        this.storage.ready().then(() => {
          this.storage.set('addNewValueFromHome', 'nutrition');
          this.navCtrl.parent.select(2);
        });
      }
    });
    actionSheet.addButton({
      text: 'Blutzucker',
      icon: 'water',
      handler: () => {
        this.addVitalSign('Blutzucker');
      }
    });
    actionSheet.addButton({
      text: 'Blutdruck',
      icon: 'heart',
      handler: () => {
        this.addVitalSign('Blutdruck');
      }
    });
    actionSheet.addButton({
      text: 'Puls',
      icon: 'pulse',
      handler: () => {
        this.addVitalSign('Puls');
      }
    });
    actionSheet.addButton({
      text: 'Gewicht',
      icon: 'speedometer',
      handler: () => {
        this.addVitalSign('Gewicht');
      }
    });
    actionSheet.addButton({
      text: 'Cancel',
      icon: 'close',
      role: 'destructive'
    });

    // present the alert popup
    actionSheet.present();
  }
  addVitalSign(param: string){
    this.storage.ready().then(() => {
      this.storage.set('addNewValueFromHome', param);
      this.navCtrl.parent.select(1);
    });
  }
}
