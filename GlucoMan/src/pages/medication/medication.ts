import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})
export class MedicationPage {
  resultFromBarcode: any;

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
/**************************************************
              scan a barcode

conneciton to cordova plugin scanner to get the barcode.
Get the medication data from the hospINDEX and
store it ith the storage.

storage:
  MedicationData: the last scanned medication
***************************************************/
  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {

        var HCIData = this.getHCIData(result.text);
        var mediData = this.getJSONData(HCIData);

        this.storage.ready().then(() => {
          this.storage.set('MedicationData', mediData);
        });
      });
    });
  }

  /**************************************************
                test for scanner

  get the information about the medication Algifor
  for testing on the web,because the cordova plugin
  only runs on the builded app.

  storage:
    MedicationData: the last scanned medication
  ***************************************************/
  scanTest() {

    var mediData = this.getHCIData('7680504110875');

    var specMediData = this.getJSONData(mediData);

    this.storage.ready().then(() => {
      this.storage.set('MedicationData', specMediData);
    });

    console.log(mediData);
    console.log(specMediData);
  }

/**************************************************
            Get medication from hospINDEX
param:
  artbar: gtni: barcode number

return:
  returns JSON object with all information about the barcode number
**************************************************/
  getHCIData(artbar) {
    // preparing variables
    var api = 'http://www.laettere.ch/carole/mina/getArticle.php';
    //console.log(api);
    var keytype = 'ARTBAR';
    //console.log(keytype);
    var key = artbar;
    //console.log(key);
    var index = 'hospINDEX';
    //console.log(index);

    // concat uri
    var uri = api + '?keytype=' + keytype + '&key=' + key + '&index=' + index;

    return this.http.get(uri).toPromise().then(function(response){
      return response;
    });
  }

/***************************************************
            Get the data in JSON format
param:
  art: article from http request

return:
  return JSON with
  - gtni: barcode number
  - descrd: description of mdeication
  - phar: pharma number
  - imgBackPack: img from the package (back)
  - imgFrontPack: img from the package (front)
  - imgBackDrug: img from the drug (back)
  - imgFrontDrug: img from the drug (front)

****************************************************/
  getJSONData(art) {

    return art.then(function(response) {

      // JSON result from the http request
      var result = JSON.parse(response._body);

      // create JSON form specific medication data
      var mediData = {};

      // if result have an image save with image and drug
      if(result.article[0].img2 = true) {
        mediData = {gtni: result.article[0].gtni,
                        description: result.article[0].dscrd,
                        pharma: result.article[0].phar,
                        imgFrontPack: result.article[0].url_packfront,
                        imgBackPack: result.article[0].url_packback,
                        imgFrontDrug: result.article[0].url_drugfront,
                        imgBackDrug: result.article[0].url_drugback};

      // otherwise without images
      } else {
        mediData = {gtni: result.article[0].gtni,
                        description: result.article[0].dscrd,
                        pharma: result.article[0].phar};
      }

      console.log(mediData);

      return mediData;
    });
  }
}
