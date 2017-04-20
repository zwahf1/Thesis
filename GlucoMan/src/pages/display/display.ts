import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {

  visibleList = [];
  schemaList = ['Individuell', 'Tief', 'Mittel', 'Hoch'];
  schema = this.schemaList[0];


  constructor(public navCtrl: NavController, public appCtrl: App, public storage: Storage) {
    this.visibleList['all'] = true;
    this.visibleList['glucose'] = true;
    this.visibleList['bloodpressure'] = true;
    this.visibleList['pulse'] = true;
    this.visibleList['weight'] = true;


    this.storage.ready().then(() => {
      this.storage.get('VisibleList').then((val) => {
        if (val) {
          this.visibleList = val;
        }
      })
      this.storage.get('Schema').then((val) => {
        if (val) {
          this.schema = val;
        }
      })
    });
  }

  visibleChange() {
    this.storage.ready().then(() => {
      this.storage.set('VisibleList', this.visibleList);
    });
  }
  schemaChange(entry){
    this.storage.ready().then(() => {
      this.storage.set('Schema', this.schema);
    });
  }
}
