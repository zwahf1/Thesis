import { Component } from '@angular/core';
import {ViewController } from 'ionic-angular';

/*****************************************************************************
DisclaimerPage - shows the data privacy statement.
*****************************************************************************/
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html'
})
export class DisclaimerPage {

  constructor(public viewCtrl: ViewController) { }

  /**
   *   method to close the popover of
   *   the data privacy statement
   * @return {[type]} [description]
   */
  close() {
    this.viewCtrl.dismiss();
  }

}
