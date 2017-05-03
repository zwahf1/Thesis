import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { InformationPage } from '../information/information';
import { EmergencyPage } from '../emergency/emergency';
import { MeasureplanPage } from '../measureplan/measureplan';
import { CheckupsPage } from '../checkups/checkups';

/**
 * home page for tabs page
 * @param  {'page-home'}  {selector   [description]
 * @param  {'home.html'}} templateUrl [description]
 * @return {[type]}                   [description]
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /**
   *
   * @param  {NavController}         publicnavCtrl    navigation of app
   * @param  {ActionSheetController} publicactionCtrl handle action sheets
   * @param  {Storage}               publicstorage    ionic storage from phone
   */
  constructor(public navCtrl: NavController, public actionCtrl: ActionSheetController, public storage: Storage) {
  }

  /**
   * change view to given target
   * @param  {string} target name of page to load
   */
  goTo(target: string) {
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
   * open an action sheet to choose the category for a new entry
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

  /**
   * add a new vital sign to the given category and open the page
   * @param  {string} category category of new vital sign
   */
  addVitalSign(category: string){
    this.storage.ready().then(() => {
      this.storage.set('addNewValueFromHome', category);
      this.navCtrl.parent.select(1);
    });
  }
}
