import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*****************************************************************************
DisclaimerPage - shows the data privacy statement.
*****************************************************************************/
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html'
})
export class DisclaimerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  close() {
    this.viewCtrl.dismiss();
  }

}
