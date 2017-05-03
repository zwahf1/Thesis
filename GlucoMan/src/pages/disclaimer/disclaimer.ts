import { Component } from '@angular/core';
import {ViewController } from 'ionic-angular';

/**
 * disclaimer page for login & settings page
 * @param  {'page-disclaimer'}  {selector   [description]
 * @param  {'disclaimer.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html'
})
export class DisclaimerPage {

  /**
   *
   * @param  {ViewController} publicviewCtrl handle view
   */
  constructor(public viewCtrl: ViewController) { }

  /**
   *   method to close the popover of the data privacy statement
   */
  close() {
    this.viewCtrl.dismiss();
  }
}
