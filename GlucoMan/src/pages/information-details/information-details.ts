import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the InformationDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-information-details',
  templateUrl: 'information-details.html'
})

export class InformationDetailsPage {
  item;
  constructor(public navParams: NavParams) {
    this.item = navParams.data.item;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationDetailsPage');
  }
}
