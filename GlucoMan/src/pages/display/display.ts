import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * display page for settings page
 * @param  {'page-display'}  {selector   [description]
 * @param  {'display.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})

export class DisplayPage {

  visibleList = [];

/**
 * get list of which charts are visible and which schema to show
 * @param  {Storage} publicstorage ionic storage from phone
 */
  constructor(public storage: Storage) {
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
    });
  }

  /**
   * store changed visible list of charts
   */
  visibleChange() {
    this.storage.ready().then(() => {
      this.storage.set('VisibleList', this.visibleList);
    });
  }
}
