import { Component } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


import { MedicationDetailPage } from '../medicationDetail/medicationDetail';

import { MidataPersistence } from '../../util/midataPersistence';
import * as TYPES from '../../util/typings/MIDATA_Types';

import { HciHospAPI } from 'hci-hospindex-api';
declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})

export class MedicationPage {

  private mp = MidataPersistence.getInstance();

  hciapi = HciHospAPI;
  // barcode scan result
  resultFromBarcode: any;
  // medication arrays
  chronicMedis: [TYPES.LOCAL_MedicationStatementRes];
  selfMedis: [TYPES.LOCAL_MedicationStatementRes];
  insulin: [TYPES.LOCAL_MedicationStatementRes];
  intolerances: [TYPES.LOCAL_MedicationStatementRes];

  /**************************************************
                    constructor

  create the medication page with parameters
    - navCtrl: navigation controller to navigate between pages
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
  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage,
    public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    // refresh page (load list)
    this.refreshPage();
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
  refreshPage() {
    let loading = this.loadingCtrl.create();

    loading.present();

    this.storage.ready().then(() => {

      this.storage.get('chronicMedis').then((val) => {
        this.chronicMedis = val;
        if (this.chronicMedis == undefined) {
          console.log("MIDATA chronicMedis");
          this.storage.set('chronicMedis', []);
        }
        console.log(this.chronicMedis);
      });
      this.storage.get('selfMedis').then((val) => {
        this.selfMedis = val;
        if (this.selfMedis == undefined) {
          console.log("MIDATA selfMedis");
          this.storage.set('selfMedis', []);
        }
        console.log(this.selfMedis);
      });
      this.storage.get('insulin').then((val) => {
        this.insulin = val;
        if (this.insulin == undefined) {
          console.log("MIDATA insulin");
          this.storage.set('insulin', []);
        }
        console.log(this.insulin);
      });
      this.storage.get('intolerances').then((val) => {
        this.intolerances = val;
        if (this.intolerances == undefined) {
          console.log("MIDATA intolerances");
          this.storage.set('intolerances', []);
        }
        console.log(this.intolerances);
      });
    });

    loading.dismiss();

  }

  /**************************************************
              medication detail page

  shows the page to the given medication with details

  params:
    - medi: medication for detail page
  ***************************************************/
  detailMedi(medis, medi: TYPES.LOCAL_MedicationStatementRes) {
    this.navCtrl.push(MedicationDetailPage, {
      array: medis,
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
        // call function with barcode from scanner
        this.saveMedicationFromHCI(result.text);
      });
    });
  }

  saveMIDATAMedication(medi: TYPES.LOCAL_MedicationStatementRes) {
    this.mp.save(medi);
  }

  getMIDATAMedications(category: string) {
    var m = this.mp.search("MedicationStatement");
    var result = [];
    console.log(m);
    // for(var i = 0; i < m.length; i++) {
    //
    //   if(m[i].note[0].text == category) {
    //     result.push(m[i]);
    //   }
    // }
    console.log(result);
    return result;
  }

  saveMedicationFromHCI(barcode) {
    var result: TYPES.LOCAL_MedicationStatementRes;
    var gtin: string;
    var dscrd: string;
    var phar: string;
    var prdno: string;
    var img: string;
    var title: string;
    //set credentials for a basic authentication (Base64)
    let email = 'EPN236342@hcisolutions.ch';
    let password = 'UMPbDJu7!W';
    let reqHeader = 'Basic ' + btoa(email + ':' + password);
    //create XMLHttp request for get the medication data form the
    //HCI Solutions db with given barcode
    var xhr = new XMLHttpRequest();
    var method = "GET";
    var url = "https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=ARTBAR&key=" +
      barcode + "&index=hospINDEX";
    //open the request for import
    xhr.open(method, url);
    //set the request header with coded credentials
    xhr.setRequestHeader('Authorization', reqHeader);
    //if the request is done and the authorization was successfull
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        //save in localstorage as LOCAL medi res
        this.storage.ready().then(() => {
          var xml = xhr.responseXML;
          var art = xml.getElementsByTagName("ART");
          // for each children (xml tag) in the article
          for (var i = 0; i < art[0].children.length; i++) {
            if (art[0].children[i].nodeName === "GTIN")
              gtin = art[0].children[i].innerHTML;
            if (art[0].children[i].nodeName === "DSCRD")
              dscrd = art[0].children[i].innerHTML;
            if (art[0].children[i].nodeName === "PHAR")
              phar = art[0].children[i].innerHTML;
            if (art[0].children[i].nodeName === "PRDNO")
              prdno = art[0].children[i].innerHTML;
            if (art[0].children[i].nodeName === "IMG2")
              img = art[0].children[i].innerHTML;
          };
          title = dscrd.split(" ")[0];

          result = {
            resourceType: "MedicationStatement",
            status: "active",
            medicationCodeableConcept: {
              coding: [{
                system: "hospINDEX",
                code: gtin,
                display: title
              }]
            },
            effectiveDateTime: new Date(),
            note: [],
            dosage: [{
              timing: {
                repeat: {
                  frequency: 0,
                  period: 0,
                  periodUnit: "d"
                }
              },
              route: {
                coding: [{
                  system: "http://snomed.info/sct",
                  code: "",
                  display: ""
                }]
              }
            }],
            article: {
              gtin: gtin,
              pharmaCode: phar,
              prodNo: prdno,
              description: dscrd,
              img: img,
              title: title,
              imgFrontPack: "",
              imgBackPack: "",
              imgFrontDrug: "",
              imgBackDrug: ""
            }
          };

          if (img === "true") {
            this.hciapi.hciGetPictureByPharmaCode(phar, "ALL").then((val) => {
              console.log(val);
              var all = val;
              // result.article.imgFrontPack = all.front;
            });
            // result.article.imgFrontPack = "https://apps.hcisolutions.ch/MyProducts/picture/" + phar + "/Pharmacode/PA/Front/F";
            // result.article.imgBackPack = "https://apps.hcisolutions.ch/MyProducts/picture/" + phar + "/Pharmacode/PA/Back/F";
            // result.article.imgFrontDrug = "https://apps.hcisolutions.ch/MyProducts/picture/" + prdno + "/ProductNr/PI/Front/F";
            // result.article.imgBackDrug = "https://apps.hcisolutions.ch/MyProducts/picture/" + prdno + "/ProductNr/PI/Back/F";
          }
          this.showMedicationCategory(result);
        }).catch(() => {
          console.log("Artikel nicht gefunden");
          let alert = this.alertCtrl.create({
            title: 'Artikel nicht gefunden',
            subTitle: "Der gescannte Artikel ist nicht verfügbar!",
            buttons: ['OK']
          });
          alert.present();
        });
        //if not ready
      } else if (xhr.readyState != XMLHttpRequest.DONE && xhr.status === 200) {
        console.log("XMLHTTPRequest not ready");
        //if bad authorization
      } else {
        console.log("Error from XMLHTTPRequest: NOT Status = 200");
      }
    };
    //send the request
    xhr.send();
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
  showMedicationCategory(medication: TYPES.LOCAL_MedicationStatementRes) {
    // create empty array for medication
    var medis = [];
    //create alert for choosing a category
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Medikamenten-Kategorie auswählen');
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
            medication.note.push({ text: data });

            if((data == "insulin") || (data == "intolerances")) {
              this.storage.get(data).then((val) => {
                // save medis in local variable (array)
                medis = val;

                // add the new medication to the current medication
                medis.push(medication);
                // save the current medication to the storage
                this.storage.set(data, medis);
                // save the medication in MIDATA
                this.saveMIDATAMedication(medication);

                navTransition.then(() => {
                  // refresh page
                  this.refreshPage();
                });
              });
            } else {
              this.showTakingMedication(medication);
            }
          });
        });
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }

  showTakingMedication(result: TYPES.LOCAL_MedicationStatementRes) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Einnahme-Art auswählen');

    alert.addInput({
      type: 'radio',
      label: 'Oral',
      value: 'Oral',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Auftragen',
      value: 'Topic'
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
        // if the category is choosed
        navTransition.then(() => {
          let coding = "";
          if (data === "Oral") {
            coding = "26643006";
          } else if (data === "Topic") {
            coding = "6064005";
          }
          // save the new parameter in the medication (JSON)
          this.storage.ready().then(() => {
            // if the category is choosed
            navTransition.then(() => {
              result.dosage[0].route.coding[0].code = coding;
              result.dosage[0].route.coding[0].display = data;

              this.storage.get(result.note[0].text).then((val) => {
                // save medis in local variable (array)
                var medis = val;

                // add the new medication to the current medication
                medis.push(result);
                // save the current medication to the storage
                this.storage.set(result.note[0].text, medis);
                // save the medication in MIDATA
                this.saveMIDATAMedication(result);

                this.refreshPage();
              });
            });
          });
        });
        return false;
      }
    });
    // present the alert popup
    alert.present();
  }
  /**
   * method to collapse and expand the charts. it's called by clicking on a divider between the charts.
   * @param  {[type]} src source element of the click
   * @return {[type]}     [description]
   */
  expand(src) {
    try {
      let element = src.parentNode.parentNode.parentNode.nextElementSibling;
      if(element.tagName == 'DIV'){
      //mode is the style attribute of the chart element
      let mode = '' + element.getAttribute('style');
      //if 'style' contains the word 'none', the method 'search' returns a
      //positive value, otherwise -1
      if (mode.search('none') < 0) {
        //the attribute 'display' is set to none to hide the chart
        element.style.display = 'none';
      } else if (mode.search('none') > 0) {
        //the attribute 'display' is set to inline to show the chart
        element.style.display = 'inline';
      }
    }
    } catch (Error) {
      let element = src.parentNode.parentNode.nextElementSibling;
      if(element.tagName == 'DIV'){
      //mode is the style attribute of the chart element
      let mode = '' + element.getAttribute('style');
      //if 'style' contains the word 'none', the method 'search' returns a
      //positive value, otherwise -1
      if (mode.search('none') < 0) {
        //the attribute 'display' is set to none to hide the chart
        element.style.display = 'none';
      } else if (mode.search('none') > 0) {
        //the attribute 'display' is set to inline to show the chart
        element.style.display = 'inline';
      }
    }
    }
  }
}
