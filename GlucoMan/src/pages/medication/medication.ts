import { Component } from '@angular/core';
import { Platform, NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { BLE } from '@ionic-native/ble';

import { MedicationDetailPage } from '../medicationDetail/medicationDetail';

import { MidataPersistence } from '../../util/midataPersistence';
import { BlePersistence } from '../../util/blePersistence';
import * as TYPES from '../../util/typings/MIDATA_Types';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

declare var cordova: any;

@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})

export class MedicationPage {

  private mp = MidataPersistence.getInstance();
  private bp = BlePersistence.getInstance();
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
  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage,
                public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public bls: BluetoothSerial) {
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

    this.storage.ready().then(() => {

      this.storage.get('chronicMedis').then((val) => {
        this.chronicMedis = val;
        if(this.chronicMedis == undefined) {
          console.log("MIDATA chronicMedis");
          this.storage.set('chronicMedis', []);
        }
      });
      this.storage.get('selfMedis').then((val) => {
        this.selfMedis = val;
        if(this.selfMedis == undefined) {
          console.log("MIDATA selfMedis");
          this.storage.set('selfMedis', []);
        }
      });
      this.storage.get('insulin').then((val) => {
        this.insulin = val;
        if(this.insulin == undefined) {
          console.log("MIDATA insulin");
          this.storage.set('insulin', []);
        }
      });
      this.storage.get('intolerances').then((val) => {
        this.intolerances = val;
        if(this.intolerances == undefined) {
          console.log("MIDATA intolerances");
          this.storage.set('intolerances', []);
        }
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
        // call function with barcode from scanner
        this.saveMedicationFromHCI(result.text);
      });
    });
  }

  saveMIDATAMedication(category, medi:TYPES.LOCAL_MedicationStatementRes) {
    this.mp.save(this.getMedicationStatementRes(category, medi));
  }

  getMIDATAMedications() {
    var m = this.mp.search("MedicationStatement");
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
    var gtin: string;
    var dscrd: string;
    var phar: string;
    var prdno: string;
    var img: string;
    var title: string;
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

        //save in localstorage as LOCAL medi res
        this.storage.ready().then(() => {
          var xml =  xhr.responseXML;
          var art = xml.getElementsByTagName("ART");
          console.log("ART = ");
          console.log(art);
          // for each children (xml tag) in the article
          for(var i = 0; i < art[0].children.length; i++) {
            if(art[0].children[i].nodeName === "GTIN")
              gtin = art[0].children[i].innerHTML;
            if(art[0].children[i].nodeName === "DSCRD")
              dscrd = art[0].children[i].innerHTML;
            if(art[0].children[i].nodeName === "PHAR")
              phar = art[0].children[i].innerHTML;
            if(art[0].children[i].nodeName === "PRDNO")
              prdno = art[0].children[i].innerHTML;
            if(art[0].children[i].nodeName === "IMG2")
              img = art[0].children[i].innerHTML;
          };
          title = dscrd.split(" ")[0];

          if(img === "true")
            result = {
              gtni: gtin,
              description: dscrd,
              pharma: phar,
              img: img,
              title: title,
              imgFrontPack: "https://apps.hcisolutions.ch/MyProducts/picture/"+phar+"/Pharmacode/PA/Front/F",
              imgBackPack: "https://apps.hcisolutions.ch/MyProducts/picture/"+phar+"/Pharmacode/PA/Back/F",
              imgFrontDrug: "https://apps.hcisolutions.ch/MyProducts/picture/"+prdno+"/ProductNr/PI/Front/F",
              imgBackDrug: "https://apps.hcisolutions.ch/MyProducts/picture/"+prdno+"/ProductNr/PI/Back/F"
            };
          else {
            result = {
              gtni: gtin,
              description: dscrd,
              pharma: phar,
              img: img,
              title: title
            };
          }
          console.log("Result = ");
          console.log(result);
          this.storage.set('MedicationData', result);
          this.showMedicationCategory(result);
        });
      //if not ready
      } else if(xhr.readyState != XMLHttpRequest.DONE && xhr.status === 200) {
        console.log("XMLHTTPRequest not ready");
      //if bad authorization
      } else {
        console.log("Error from XMLHTTPRequest: NOT Status = 200");
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
              // save the medication in MIDATA
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

  connectBLS() {
    var data = new Uint8Array(2);
    data[0] = 0x00;
    data[1] = 0x01;
    console.log(data);
    var data1 = new Uint16Array(2);
    data1[0] = 0x00;
    data1[1] = 0x01;
    console.log(data1);
    this.bls.enable().then(() => {
      this.bls.connect("00:13:7B:59:C5:A8").subscribe(val => {
        console.log(val);
      });
      this.bls.subscribeRawData().subscribe((val) => {
        console.log("subscribeRaw2");
        console.log(val);
        var bytes = new Uint8Array(val);
        if (bytes.length == 25) {
            console.log("bytes length is 25");
        }
      }, (err) => {
        console.log(err);
      }, () => {
        console.log("completed");
      });

      this.bls.clear().then((success) => {
        console.log("clear2");
        console.log(success);
        this.bls.write(data).then(function(succ) {
          console.log("write2");
          console.log(succ);
        }, (err) => {
          console.log("ERR WRITE");
          console.log(err);
        });
      });
    });
  }

          // this.bls.write(data1.buffer).then(val => {
          //   console.log(val);
            // if(val === "OK") {
                // this.bls.disconnect().then(() => {
                //   console.log("disconnect");
                // });
                // }
          // });
          // this.bls.write(data2).then(val => {
          //   console.log(val);
          // });


  connectBLE() {
    this.bp.enable();
    var result = this.bp.startScan([]).subscribe(device => {
      console.log(JSON.stringify(device));
    });
    setTimeout(() => {
      this.bp.stopScan().then(() => {
        console.log("stopped is stopped");
      });
    }, 10000);
    console.log("connect to device");
    this.bp.connect("00:13:7B:59:C5:A8").subscribe(val => {
      console.log(val);
    });
  }
}
