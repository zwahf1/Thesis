import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})
export class MedicationPage {
  resultFromBarcode: any;

  hospIndexMedi: Observable<any>;

  chronicMedis: [{title: string, dose: string}];
  selfMedis: [{title: string, dose: string}];
  insulin: [{title: string, dose: string}];
  intolerances: [{title: string, dose: string}];

  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage, public http: Http) {


    this.storage.ready().then(() => {

      //for testing --------------------------
      this.storage.set('chronicMedis', [{title: "Algifor", dose: "10mg"},{title: "Ibuprofen",dose: "2/Tag"}]);
      this.storage.set('selfMedis', [{title: "Algifor", dose: "10mg"},{title: "Ibuprofen",dose: "2/Tag"}]);
      this.storage.set('insulin', [{title: "Algifor", dose: "10mg"},{title: "Ibuprofen",dose: "2/Tag"}]);
      this.storage.set('intolerances', [{title: "Algifor", dose: "10mg"},{title: "Ibuprofen",dose: "2/Tag"}]);
      //-------------------------------------

      this.storage.get('chronicMedis').then((val) => {
        this.chronicMedis = val;
      })
      this.storage.get('selfMedis').then((val) => {
        this.selfMedis = val;
      })
      this.storage.get('insulin').then((val) => {
        this.insulin = val;
      })
      this.storage.get('intolerances').then((val) => {
        this.intolerances = val;
      })
    });
  }

  detailMedi(medi) {

  }

  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        this.storage.set('valueBarcodeMedication', result.text);
        this.getMedi(result);
      });
    });
  }
// get the medicament for the hospIndex
  getMedi(code) {
    console.log(code);
    this.http.get("https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=ARTBAR&key=7680504110875&index=hospINDEX")
    .map(res => res.json()).subscribe(code => this.resultFromBarcode = code);
    console.log("THE WINNER IS "+this.resultFromBarcode);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
