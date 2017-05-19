import { Component } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController } from 'ionic-angular';
import { MedicationDetailPage } from '../medicationDetail/medicationDetail';
import { Storage } from '@ionic/storage';

import { MidataPersistence } from '../../util/midataPersistence';
import * as TYPES from '../../util/typings/MIDATA_Types';

import { HciHospAPI } from 'hci-hospindex-api';
import { Http } from '@angular/http';

declare var cordova: any;
/**
 * medication page for tabs page
 * @param  {'page-medication'}  {selector   [description]
 * @param  {'medication.html'}} templateUrl [description]
 */
@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})

export class MedicationPage {

  private mp = MidataPersistence.getInstance();

  hciapi = HciHospAPI;
  // medication arrays
  chronicMedis: TYPES.LOCAL_MedicationStatementRes[] = [];
  selfMedis: TYPES.LOCAL_MedicationStatementRes[] = [];
  insulin: TYPES.LOCAL_MedicationStatementRes[] = [];
  intolerances: TYPES.LOCAL_MedicationStatementRes[] = [];

  /**
   * @param  {NavController}     publicnavCtrl     navigation of app
   * @param  {Platform}          publicplatform    platform of app
   * @param  {Storage}           publicstorage     ionic storage from phone
   * @param  {Http}              publichttp        http requests
   * @param  {AlertController}   publicalertCtrl   handle alerts
   * @param  {LoadingController} publicloadingCtrl show loading
   */
  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage,
    public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
      this.refreshPage();
  }

  /**
   * refresh the medication list by save the medication from storage
   * into the category (arrays) of the html-lists.
   */
  refreshPage() {
    // create loading and show it
    let loading = this.loadingCtrl.create();
    loading.present();
    // if storage is ready to use
    this.storage.ready().then(() => {
      // get all chronic medis, empty array if undefined
      this.storage.get('chronicMedis').then((val) => {
        if (val != undefined) {
          this.chronicMedis = val;
        }
        this.storage.set('chronicMedis',this.chronicMedis);
      });
      // get all self medis, empty array if undefined
      this.storage.get('selfMedis').then((val) => {
        if (val != undefined) {
          this.selfMedis = val;
        }
        this.storage.set('selfMedis',this.selfMedis);
      });
      // get all insulin medis, empty array if undefined
      this.storage.get('insulin').then((val) => {
        if (val != undefined) {
          this.insulin = val;
        }
        this.storage.set('insulin',this.insulin);
      });
      // get all intolerances, empty array if undefined
      this.storage.get('intolerances').then((val) => {
        if (val != undefined) {
          this.intolerances = val;
        }
        this.storage.set('intolerances',this.intolerances);
      });
    });
    loading.dismiss();
  }

  /**
   * refresh if page is loaded
   */
  ionViewDidEnter() {
    // if storage is ready to use
    this.storage.ready().then(() => {
      // if view must be refresht
      this.storage.get('changeTheMedicationView').then((val) => {
        if(val) {
          this.refreshPage();
          this.storage.set('changeTheMedicationView', false);
        }
      });
    });
  }

  /**
   * shows the page to the given medication with details
   * @param  {Array<TYPES.LOCAL_MedicationStatementRes>} medis medication array from the detail
   * @param  {TYPES.LOCAL_MedicationStatementRes}        medi  medication from the detail
   */
  detailMedi(medis: Array<TYPES.LOCAL_MedicationStatementRes>, medi: TYPES.LOCAL_MedicationStatementRes) {
    this.navCtrl.push(MedicationDetailPage, {
      array: medis,
      medi: medi
    });
  }

  /**
   * conneciton to cordova plugin scanner to get the barcode.
   * Get the medication data from the hospINDEX and
   * store it ith the storage
   */
  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        // call function with barcode from scanner
        this.saveMedicationFromHCI(result.text);
      });
    });
  }

  /**
   * save the given medication on the midata account
   * @param  {TYPES.LOCAL_MedicationStatementRes} medi medication to save
   */
  saveMIDATAMedication(medi: TYPES.LOCAL_MedicationStatementRes) {
    this.mp.save(medi);
  }

  /**
   * get the medication of the given barcode from the HCI Solutions DB and
   * save the result if possible in storage and midata.
   * open alerts for medication category and route
   * @param  {string} barcode barcode from swissmedic
   */
  saveMedicationFromHCI(barcode: string) {
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
          // for each children (xml tag) in the article get relevant data
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
          // create result JSON
          result = {
            resourceType: "MedicationStatement",
            status: "active",
            medicationCodeableConcept: {
              coding: [{
                system: "http://hcisolutions.ch/hospINDEX",
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
              imgFrontBlister: "",
              imgBackBlister: "",
              imgFrontDrug: "",
              imgBackDrug: ""
            }
          } as TYPES.LOCAL_MedicationStatementRes;
          // if imgages are available get them with hci-api and save them
          if (img === "true") {
            this.hciapi.hciGetPicture("ALL", phar, prdno).then((val: any) => {
              console.log(val);
              var all = val;
              result.article.imgFrontPack = all.front;
              result.article.imgBackPack = all.back;
              result.article.imgFrontBlister = all.detailFront;
              result.article.imgBackBlister = all.detailBack;
              result.article.imgFrontDrug = all.medicationFront;
              result.article.imgBackDrug = all.medicationBack;
            });
          }
          // show medication category befor saving
          this.showMedicationCategory(result);
          // if an error occurs
        }).catch(() => {
          console.log("Artikel nicht gefunden");
          // create alert for info
          let alert = this.alertCtrl.create({
            title: 'Artikel nicht gefunden',
            subTitle: "Der gescannte Artikel ist nicht verfügbar!",
            buttons: ['OK']
          });
          alert.present();
        });
      //if no response yet but authorized
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

  /**
   * open an alert for choosing the category of the given medication.
   * save the category to the medication and open next alert if necessary or save it
   * @param  {TYPES.LOCAL_MedicationStatementRes} medication medication to save
   */
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
            // if medi category is insulin or intolerances
            if((data == "insulin") || (data == "intolerances")) {
              // get choosen category
              this.storage.get(data).then((val) => {
                // save medis in local variable (array)
                medis = val;
                // add the new medication to the current medication
                medis.push(medication);
                // save the current medication to the storage
                this.storage.set(data, medis);
                // save the medication in MIDATA
                // this.saveMIDATAMedication(medication); TODO
                // refresh page
                navTransition.then(() => {
                  this.refreshPage();
                });
              });
            // if category chronic and self medis
            } else {
              // show taking alert
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

  /**
   * open an alert for choosing the route of the given medication (category: chronicMedis & selfMedis).
   * save the route to the medication and save it
   * @param  {TYPES.LOCAL_MedicationStatementRes} result medication to save
   */
  showTakingMedication(result: TYPES.LOCAL_MedicationStatementRes) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle('Wirkstoffaufnahme');
    // radio buttom
    alert.addInput({
      type: 'radio',
      label: 'Mund',
      value: 'Mund',
      checked: true
    });
    // radio button
    alert.addInput({
      type: 'radio',
      label: 'Augen',
      value: 'Augen'
    });
    // radio button
    alert.addInput({
      type: 'radio',
      label: 'Spritzen',
      value: 'Spritzen'
    });
    // radio button
    alert.addInput({
      type: 'radio',
      label: 'Eincremen',
      value: 'Eincremen'
    });
    // button to cancel
    alert.addButton('Cancel');
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      // data: choosen taking
      handler: (data) => {
        // begin the alert's dismiss transition
        let navTransition = alert.dismiss();
        // if the taking is choosed
        navTransition.then(() => {
          let coding = "";
          let codingDisplay = "";
          // check which is selected and store the code and display for it
          if (data === "Mund") {
            coding = "26643006";
            codingDisplay = "Oral";
          }
          else if (data === "Augen") {
            coding = "54485002";
            codingDisplay = "Ophthalmic";
          }
          else if (data === "Spritzen") {
            coding = "34206005";
            codingDisplay = "Subcutaneous";
          }
          else if (data === "Eincremen") {
            coding = "6064005";
            codingDisplay = "Topical";
          }
          // save the new parameter in the medication (JSON)
          this.storage.ready().then(() => {
            navTransition.then(() => {
              result.dosage[0].route.coding[0].code = coding;
              result.dosage[0].route.coding[0].display = codingDisplay;
              result.dosage[0].route.text = data;
              // get category of medication
              this.storage.get(result.note[0].text).then((val) => {
                // save medis in local variable (array)
                var medis = val;
                // add the new medication to the current medication
                medis.push(result);
                // save the current medication to the storage
                this.storage.set(result.note[0].text, medis);
                // save the medication in MIDATA
                this.saveMIDATAMedication(result);
                // refresh page
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
   * @param  {any} src source element of the click
   */
  expand(src: any) {
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
