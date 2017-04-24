import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
page to present the information about a choosen thema in the informationpage
**/
@Component({
  selector: 'page-information-details',
  templateUrl: 'information-details.html'
})

export class InformationDetailsPage {
  item;
  /**
  constructor loads the navParams into loval variable.
  **/
  constructor(public navParams: NavParams) {
    this.item = navParams.data.item;
  }
}
