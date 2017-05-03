import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * information detail page for information page
 * @param  {'page-information-details'}  {selector   [description]
 * @param  {'information-details.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-information-details',
  templateUrl: 'information-details.html'
})

export class InformationDetailsPage {
  item: any;

  /**
   * save the given information item over navigation parameters local
   * @param  {NavParams} publicnavParams navigation parameters with item
   */
  constructor(public navParams: NavParams) {
    this.item = navParams.data.item;
  }
}
