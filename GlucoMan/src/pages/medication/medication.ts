import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { MedicationDetailPage } from '../medicationDetail/medicationDetail';

import * as TYPES from '../../util/typings/MIDATA_Types';

declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})

export class MedicationPage {
  // barcode scan result
  resultFromBarcode: any;
  // medication arrays
  chronicMedis: [TYPES.LOCAL_MedicationRes];
  selfMedis: [TYPES.LOCAL_MedicationRes];
  insulin: [TYPES.LOCAL_MedicationRes];
  intolerances: [TYPES.LOCAL_MedicationRes];

/**************************************************
                  constructor

create the medication page with parameters
  - nacCtrl: navigation controller to navigate between pages
  - platform: platform for using plugins
  - storage: local storage
  - http: for http requests
  - alertCtrl: alert controller to handle alerts (popups)

storage SET:
  - chronicMedis: all longtime medication
  - selfMedis: all self medication
  - insulin: all insulin
  - intolerances: all medication intolerances
***************************************************/
  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage, public http: Http, public alertCtrl: AlertController) {
    // if storage is ready to use
    this.storage.ready().then(() => {
      // import all medication from MIDATA
      this.storage.set('chronicMedis', []);
      this.storage.set('selfMedis', []);
      this.storage.set('insulin', []);
      this.storage.set('intolerances', []);
      // refresh page (load list)
      this.refreshPage();
    });
  }

/**************************************************
                refresh page

refresh the medication list by save the medication
into the category lists (arrays).

storage GET:
  - chronicMedis: all longtime medication
  - selfMedis: all self medication
  - insulin: all insulin
  - intolerances: all medication intolerances
***************************************************/
  refreshPage () {
    this.storage.ready().then(() => {
      this.storage.get('chronicMedis').then((val) => {
        this.chronicMedis = val;
      });
      this.storage.get('selfMedis').then((val) => {
        this.selfMedis = val;
      });
      this.storage.get('insulin').then((val) => {
        this.insulin = val;
      });
      this.storage.get('intolerances').then((val) => {
        this.intolerances = val;
      });
    });
  }

/**************************************************
            medication detail page

shows the page to the given medication with details

params:
  - medi: medication for detail page
***************************************************/
  detailMedi(medi) {
    this.navCtrl.push(MedicationDetailPage, {
      medi: medi
    });
  }

/**************************************************
              scan a barcode

conneciton to cordova plugin scanner to get the barcode.
Get the medication data from the hospINDEX and
store it ith the storage.

storage SET:
  - MedicationData: the last scanned medication
***************************************************/
  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {

        var HCIData = this.getHCIData(result.text);
        var mediData = this.getJSONData(HCIData);

        this.storage.ready().then(() => {
          this.storage.set('MedicationData', mediData);
          this.showRadio(mediData);
        });
      });
    });
  }

/**************************************************
              test for scanner

get the information about the medication Algifor
for testing on the web,because the cordova plugin
only runs on the builded app.

storage SET:
  - MedicationData: the last scanned medication
***************************************************/
  scanTest() {
    // get the medication data from the hospINDEX request
    var mediData = this.getHCIData('7680504110875');
    // get only the relevant data from the medication data
    //var specMediData = this.getJSONData(mediData);
    // if storage is ready to use
    this.storage.ready().then(() => {
      // save the new medication in the storage
    //  this.storage.set('MedicationData', specMediData);
    });
    // show alert for choosing category
    //this.showRadio(specMediData);

    console.log(mediData);
  }

  getGet(artbar) {
    let email = 'EPN236342@hcisolutions.ch';
    let password = 'UMPbDJu7!W';

    let creds = btoa(email+':'+password);

    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + creds);
    headers.append('Content-Type', 'text/html');
    var options = new RequestOptions({headers: headers});
    this.http.get( 'https://index.hcisolutions.ch/index/current/get.asmx?schema=ARTICLE&keytype=ARTBAR&key=7680504110875&index=hospINDEX', options)
    .map(
      res => console.log(res)
    )
    .subscribe(
      data => console.log(data),
      err => console.log(err)
    );
  }

  getHCI (barcode) {
    let email = 'EPN236342@hcisolutions.ch';
    let password = 'UMPbDJu7!W';

    let creds = btoa(email+':'+password);
    let body = {'Authorization': 'Basic '+creds};

    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({
			headers: headers
		});


    return this.http.post('https://index.hcisolutions.ch/index/current/get.asmx?schema=ARTICLE&keytype=ARTBAR&key=7680504110875&index=hospINDEX',
    body, options).toPromise().then(response => { console.log(response.json()) }, this.handleError);

/*
    return new Promise(resolve => {

      this.http.post('https://index.hcisolutions.ch/index/current/get.asmx?schema=ARTICLE&keytype=ARTBAR&key=7680504110875&index=hospINDEX',
      body, options).subscribe(data => {

        if(data.json().success){
          console.log(data.json().token);
        }
      });
    });

*/
  }

  handleError(error) {
    console.log(error);
  }

/**************************************************
            Get medication from hospINDEX

Function to get the medication data from the webserver
hospINDEX over http request.

params:
  - artbar: barcode number from medication

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

Function to get the necessary medication data in JSON

params:
  - art: article from http request

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
      // create JSON for specific medication data
      var mediData = {};
      // Get parameters of description
      var desc = result.article[0].dscrd;
      var title = desc.split(" ")[0];

      // if result have an image save with image and drug
      if(result.article[0].img2 = true) {
        mediData = {gtni: result.article[0].gtni,
                        description: result.article[0].dscrd,
                        pharma: result.article[0].phar,
                        img: result.article[0].img2,
                        imgFrontPack: result.article[0].url_packfront,
                        imgBackPack: result.article[0].url_packback,
                        imgFrontDrug: result.article[0].url_drugfront,
                        imgBackDrug: result.article[0].url_drugback,
                        title: title};

      // otherwise without images
      } else {
        mediData = {gtni: result.article[0].gtni,
                        description: result.article[0].dscrd,
                        pharma: result.article[0].phar,
                        img: result.article[0].img2,
                        title: title};
      }
      // return the new medication
      return mediData;
    });
  }

/***************************************************
        show the diffrent medication categories

open an alert for choosing the category of the entered
medication.

params:
  - medication: the new medication to save (got by barcode)

categories:
  - Regelmässiges Medikament: longtime medication
  - Selbstgekauftes Medikament: self medication
  - Insulin: the used insulin
  - Unverträglichkeiten: medication intolerances

storage SET:
  - chronicMedis: all longtime medication
  - selfMedis: all self medication
  - insulin: all insulin
  - intolerances: all medication intolerances

storage GET:
  - chronicMedis: all longtime medication
  - selfMedis: all self medication
  - insulin: all insulin
  - intolerances: all medication intolerances
****************************************************/
  showRadio(medication) {
    // create empty array for medication
    var medis = [];
    //create alert for choosing a category
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Kategorie für Medikation auswählen');
    // radio button (category)
    alert.addInput({
      type: 'radio',
      label: 'Regelmässiges Medikament',
      value: 'chronicMedis'
    });
    // radio button (category)
    alert.addInput({
      type: 'radio',
      label: 'Selbstgekauftes Medikament',
      value: 'selfMedis',
      checked: true
    });
    // radio button (category)
    alert.addInput({
      type: 'radio',
      label: 'Insulin',
      value: 'insulin'
    });
    // radio button (category)
    alert.addInput({
      type: 'radio',
      label: 'Unverträglichkeit',
      value: 'intolerances'
    });
    // button to cancel
    alert.addButton('Cancel');
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      // data: choosen category
      handler: (data) => {
        // user has clicked the new medication button
        // begin the alert's dismiss transition
        let navTransition = alert.dismiss();
        // If stroage is ready to use
        this.storage.ready().then(() => {
          // if the category is choosed
          navTransition.then(() => {
            // get the actual medication of the choosen category
            this.storage.get(data).then((val) => {
              // save medis in local variable (array)
              medis = val;
              // get the JSON of the medication
              medication.then(function(response) {
                // add the new medication to the current medication
                medis.push(response);
              });
              // save the current medication to the storage
              this.storage.set(data, medis);
              // refresh page
              this.refreshPage();
            });
          });
        });
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }
}
