import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-measurements',
  templateUrl: 'measurements.html'
})
export class MeasurementsPage {

  constructor(public navCtrl: NavController) {

    this.options = {
      title : { text : 'chart 1'},
      series : [{
        data : [1,2,3,4,5,6,7,8,9],
      }]
    };
  }
  options: Object;
}
