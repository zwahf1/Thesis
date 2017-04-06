import { Component } from '@angular/core';
//import { Http } from '@anguar/http';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova: any;
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html'
})
export class NutritionPage {
  //  resultBarcode: any;
  kh_gram: any = '10';
  carboValues: number[] = [];


  constructor(public navCtrl: NavController, public platform: Platform,
    public storage: Storage) {

  }

  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        try {
          this.getXMLfromFDDB(result.text);
          this.getJSONfromOpenFood(result);
        } catch (Error) {
          alert("Query from FDDB or OpenFood didn't work");
        }
      });
    });
  }
  getXMLfromFDDB(barcode) {
    let key = 'ZPAQGQY9Q75GHB2593R7V911';
    let code = barcode;
    console.log(code);
    //let code = '7613356140899';
    var xhr = new XMLHttpRequest();
    var method = "GET";
    var url = "http://fddb.info/api/v17/search/item.xml?q=" + barcode + "&apikey=" + key + "&lang=de";
    console.log(url);
    xhr.open(method, url);


    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let xml = xhr.responseXML;
        console.log(xml);
        try {
          let result = xml.getElementsByTagName("result");
          let items = result[0].getElementsByTagName("items");
          let item = items[0].getElementsByTagName('item');
          let data = item[0].getElementsByTagName('data');
          let kh_gram = data[0].getElementsByTagName('kh_gram');
          this.kh_gram = kh_gram[0].textContent;
          this.carboValues.push(kh_gram[0].textContent);
        } catch (Error) {
          alert("no data in fddb available");
        }

        console.log(this.carboValues);

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
  getJSONfromOpenFood(barcode) {
    let key = 'e30f2ff2fdc37588275626f176966ea6';
    let code = barcode;
    //let code = '7613356140899';
    var xhr = new XMLHttpRequest();
    var method = "GET";
    var reqHeaders = 'Token token="' + key + '"';
    var url = "https://www.openfood.ch/api/v3/products?barcodes=" + code + "&api_key=" + key;

    xhr.open(method, url);
    //set the request header with coded credentials
    xhr.setRequestHeader("Authorization", reqHeaders);
    //if the request is done and the authorization was successfull
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let art = JSON.parse(xhr.responseText);
        console.log(art);
        let valuePort;
        let value100;
        try {
          valuePort = art.data[0].nutrients.carbohydrates.per_portion;
          value100 = art.data[0].nutrients.carbohydrates.per_hundred;
        } catch (Error) {
          alert("no data in open food available");
        }
        //let result = xml.getElementsByTagName("result");
        console.log('Portion: ' + valuePort);
        console.log('100g: ' + value100);
        this.carboValues.push(value100);

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
}
