import { Component } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { BLE } from '@ionic-native/ble';

import { MedicationDetailPage } from '../medicationDetail/medicationDetail';

import { MidataPersistence } from '../../util/midataPersistence';
import * as TYPES from '../../util/typings/MIDATA_Types';

declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})

export class MedicationPage {

  private mp = MidataPersistence.getInstance();
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
  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage, public ble: BLE,
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
  refreshPage () {
    let loading = this.loadingCtrl.create();

    loading.present();

    setTimeout(() => {
      this.storage.ready().then(() => {

        if((this.chronicMedis == undefined) &&
            (this.selfMedis == undefined) &&
            (this.insulin == undefined) &&
            (this.intolerances == undefined)) {
          // import all medication from MIDATA
          this.storage.set('chronicMedis', []);
          this.storage.set('selfMedis', []);
          this.storage.set('insulin', []);
          this.storage.set('intolerances', []);
        }

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

      loading.dismiss();
    }, );

  }

/**************************************************
            medication detail page

shows the page to the given medication with details

params:
  - medi: medication for detail page
***************************************************/
  detailMedi(medi:TYPES.LOCAL_MedicationStatementRes) {
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

        this.saveMedicationFromHCI(result.text);
      });
    });
  }

  saveMIDATAMedication(category, medi:TYPES.LOCAL_MedicationStatementRes) {
    this.mp.save(this.getMedicationStatementRes(category, medi));
  }

  getMIDATAMedications() {
    var m =this.mp.search("MedicationStatement");
    console.log(m);
    return m;
  }


  saveMIDATAWeight(v,d) {
    this.mp.save(this.getWeightRes(55.1,new Date()));
  }

  getMIDATAObservations() {
    var o =this.mp.search("Observation");
    console.log(o);
    return o;
  }

/**************************************************
              test for HCI hospINDEX

get the information about the medication Algifor
for testing on the web,because the cordova plugin
only runs on the builded app.

storage SET:
  - MedicationData: the last scanned medication
***************************************************/
  scanTest() {
    // save the medication data from the hospINDEX request
    this.saveMedicationFromHCI('7680504110875');
  }

  saveMedicationFromHCI(barcode) {
    var result: TYPES.LOCAL_MedicationStatementRes;
    //set credentials for a basic authentication (Base64)
    let email = 'EPN236342@hcisolutions.ch';
    let password = 'UMPbDJu7!W';
    let reqHeader = 'Basic '+btoa(email+':'+password);
    //create XMLHttp request for get the medication data form the
    //HCI Solutions db with given barcode
    var xhr = new XMLHttpRequest();
    var method = "GET";
    var url = "https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=ARTBAR&key="+
                barcode+"&index=hospINDEX";
    //open the request for import
    xhr.open(method, url);
    //set the request header with coded credentials
    xhr.setRequestHeader('Authorization',reqHeader);
    //if the request is done and the authorization was successfull
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //save in localstorage -------------------------------------------------------------
        this.storage.ready().then(() => {
          var xml =  xhr.responseXML;
          var art = xml.getElementsByTagName("ART");
          console.log("ART = ");
          console.log(art);
          if(art[0].children[29].innerHTML === "true")
            result = {
              gtni: art[0].children[2].innerHTML,
              description: art[0].children[20].innerHTML,
              pharma: art[0].children[1].innerHTML,
              img: art[0].children[29].innerHTML,
              title: art[0].children[20].innerHTML.split(" ")[0],
              imgFrontPack: "https://apps.hcisolutions.ch/MyProducts/picture/"+art[0].children[1].innerHTML+"/Pharmacode/PA/Front/F",
              imgBackPack: "https://apps.hcisolutions.ch/MyProducts/picture/"+art[0].children[1].innerHTML+"/Pharmacode/PA/Back/F",
              imgFrontDrug: "https://apps.hcisolutions.ch/MyProducts/picture/"+art[0].children[6].innerHTML+"/ProductNr/PI/Front/F",
              imgBackDrug: "https://apps.hcisolutions.ch/MyProducts/picture/"+art[0].children[6].innerHTML+"/ProductNr/PI/Back/F"
            };
          else {
            result = {
              gtni: art[0].children[2].innerHTML,
              description: art[0].children[20].innerHTML,
              pharma: art[0].children[1].innerHTML,
              img: art[0].children[29].innerHTML,
              title: art[0].children[20].innerHTML.split(" ")[0]
            };
          }
          console.log("Result = ");
          console.log(result);
          this.storage.set('MedicationData', result);
          this.showMedicationCategory(result);
        });
      //if bad authorization
      } else {
        console.log("Error!");
      }
    };
    //send the request
    xhr.send();
  }

  //*******************************************************************************


  getWeightRes(v,d) {
    var weight: TYPES.FHIR_ObservationRes_1Value;
    var weight = {
      resourceType: 'Observation',
      status: "preliminary",
      effectiveDateTime: d,
      category: {
        coding:  [{
            system: "http://hl7.org/fhir/observation-category",
            code: "vital-signs",
            display: "Vital-Signs"
        }]
      },
      code: {
        text: "Gewicht",
        coding: [{
          system: 'http://loinc.org',
          code: '3141-9',
          display: 'Weight Measured'
        }]
      },
      valueQuantity: {
        value: v,
        unit: 'kg',
        system: 'http://unitsofmeasure.org'
      }
    } as TYPES.FHIR_ObservationRes_1Value;
    return weight;
  }


  getMedicationStatementRes(category, medi:TYPES.LOCAL_MedicationStatementRes) {
    var mediRes:TYPES.FHIR_MedicationStatementRes;
    mediRes = {
      resourceType: "MedicationStatement",
      status: "active",
      medicationCodeableConcept: {
        coding: [{
          system: "http://snomed.info/sct",
          code: "27658006",
          display: "Amoxicillin"
        }]
      },
      effectiveDateTime:new Date(),
      taken:"y",
      note: [{
        text: category
      }],
      dosage:[{
        text:"one capsule three times daily",
        timing: {
          repeat: {
            frequency:3,
            period:1,
            periodUnit:"d"
          }
        },
        asNeededBoolean:false,
        route: {
          coding: [{
            system:"http://snomed.info/sct",
            code:"260548002",
            display:"Oral"
          }]
        }
      }]

    } as TYPES.FHIR_MedicationStatementRes;
    return mediRes;
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
  showMedicationCategory(medication:TYPES.LOCAL_MedicationStatementRes) {
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
              // add the new medication to the current medication
              medis.push(medication);
              // save the current medication to the storage
              this.storage.set(data, medis);

              this.saveMIDATAMedication(data,medication);

              navTransition.then(() => {
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



  connectBLE() {
    var result = this.ble.startScan([]).subscribe(device => {
      console.log(JSON.stringify(device));
      this.ble.connect(device.id);
    });
    setTimeout(() => {
      this.ble.stopScan().then(() => {
        console.log("stopped is stopped");
      });
    }, 5000);



  }
}
