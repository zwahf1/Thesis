import { Component } from '@angular/core';
import { DayNutrition } from '../../util/DayNutrition';
import { DetailNutrition } from '../../util/DetailNutrition';
import { Platform, NavController, AlertController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova: any;
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html'
})
export class NutritionPage {
  //  resultBarcode: any;

  nutritionList: DayNutrition[] = [];
  nutritionDetailList: DetailNutrition[] = [];
  carboValuesPort: number[] = [];
  carboValues100: number[] = [];
  valuePort: any;
  valueCarbo: any;
  desc: any;

  constructor(public navCtrl: NavController, public platform: Platform,
    public storage: Storage, public alertCtrl: AlertController) {
    this.storage.ready().then(() => {
      this.storage.get('NutritionDetailList').then((val) => {
        if (val) {
          this.nutritionDetailList = val;
          this.createNutritionList();
        }
      })
    });
  }
  ionViewDidEnter() {
    this.createNutritionList();
  }
  slideChanged() {
    this.createNutritionList();
  }
  saveDetailList() {
    this.storage.ready().then(() => {
      this.storage.set('NutritionDetailList', this.nutritionDetailList);
    });
  }

  scan() {
    this.valuePort = null;
    this.valueCarbo = null;
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan(
        function(result) {
          if (result.text) {
            try {
              this.getDataFromOpenFoodFacts(result.text);
            } catch (Error) {
              alert("no data found");
            } finally {

            }
          }
        },
        function(error) {
          alert("Scanning failed: " + error);
        }, {
          resultDisplayDuration: 50,
          orientation: "portrait",
        });
    });
  }

  edit(item) {
    console.log(item);
    //create alert for choosing a category
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle("Details eingeben");
    alert.setCssClass("dataDetails");
    //
    alert.addInput({
      type: 'text',
      label: 'Beschreibung',
      name: 'desc',
      value: item.desc
    });
    alert.addInput({
      type: 'number',
      label: 'Portion',
      name: 'port',
      value: item.port
    });

    //
    alert.addInput({
      type: 'number',
      label: 'Kohlenhydrate',
      name: 'carb',
      value: item.carb
    });

    // button to cancel
    alert.addButton('Cancel');
    // button to cancel
    alert.addButton({
      text: 'Löschen',
      handler: (data) => {
        console.log(this.nutritionDetailList);
        let index: number = this.nutritionDetailList.indexOf(item);
        if (index !== -1) {
          this.nutritionDetailList.splice(index, 1);
        }
        console.log(this.nutritionDetailList);
      }
    });
    // button for save medication
    alert.addButton({
      text: 'Ok',
      handler: (data) => {
        item.desc = data.desc;
        item.port = data.port;
        item.carb = data.carb;
        let index: number = this.nutritionDetailList.indexOf(item);
        this.nutritionDetailList[index] = item;
        this.saveDetailList();
      }
    });
    // present the alert popup
    alert.present();
  }

  getDayTime() {
    let d = new Date();
    let h = d.getHours();

    if (h < 4) {
      //wenn Nacht
      return 6;
    } else if (h < 9) {
      //wenn Morgen
      return 1;
    } else if (h < 11) {
      //wenn Znüni
      return 2;
    } else if (h < 14) {
      //wenn Mittag
      return 3;
    } else if (h < 17) {
      //wenn Zvieri
      return 4;
    } else if (h < 22) {
      //wenn Abend
      return 5;
    } else {
      //wenn Nacht
      return 6;
    }
  }

  showDataDetails() {
    //create alert for choosing a category
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle("Details eingeben");
    alert.setCssClass("dataDetails");
    //
    alert.addInput({
      type: 'text',
      label: 'Beschreibung',
      name: 'desc',
      value: this.desc
    });
    alert.addInput({
      type: 'number',
      label: 'Portion',
      name: 'port',
      value: this.valuePort
    });

    //
    alert.addInput({
      type: 'number',
      label: 'Kohlenhydrate',
      name: 'carbo',
      value: this.valueCarbo
    });

    // button to cancel
    alert.addButton('Cancel');
    // button for save medication
    alert.addButton({
      text: 'Ok',
      // handle the click event for the OK button
      // data: choosen category
      handler: (data) => {
        this.desc = data.desc;
        this.valuePort = data.port;
        this.valueCarbo = data.carbo;
        this.newNutrition();
      }
    });
    // present the alert popup
    alert.present();
  }

  newNutrition() {
    this.nutritionDetailList.push(new DetailNutrition(this.desc, this.valuePort, this.valueCarbo));
    this.saveDetailList();
    this.createNutritionList();
  }

  createNutritionList() {
    this.nutritionList = [];
    for (let entry of this.nutritionDetailList) {
      //  let entry = this.nutritionDetailList[this.nutritionDetailList.length-1];
      let dateEntry = entry.date;
      let dateLastInList = new Date(0);
      try {
        dateLastInList = this.nutritionList[this.nutritionList.length - 1][0];
      } catch (Error) {
        console.log('catched; there\'s no date in the list');
      }
      let diffDate = dateEntry.getTime() - dateLastInList.getTime();
      let timeOfDay = 86400000;
      if (!this.nutritionList[0] || (Math.abs(diffDate) > timeOfDay) || ((dateEntry.getDate != dateLastInList.getDate) && (Math.abs(diffDate) > timeOfDay))) {
        this.nutritionList.push(new DayNutrition);
        this.nutritionList[0][0] = entry.date;
        console.log('did if condition');
      }
      let tempCarb: number = 0
      tempCarb = this.nutritionList[this.nutritionList.length - 1][this.getDayTime()];
      /*      if (!(tempCarb > 0)) {
              tempCarb = 0;
            }
            */
      this.nutritionList[this.nutritionList.length - 1][this.getDayTime()] = (parseInt('' + entry.carb) + parseInt('' + tempCarb));
      console.log(entry);
      console.log(this.nutritionList);
    }
  }
  getDataFromFDDB(barcode) {
    let key = 'ZPAQGQY9Q75GHB2593R7V911';
    let code = barcode;
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
        let weightPort;
        let valuePort;
        let value100;
        try {
          let result = xml.getElementsByTagName("result");
          let items = result[0].getElementsByTagName("items");
          let item = items[0].getElementsByTagName('item');
          let data = item[0].getElementsByTagName('data');
          let servings = item[0].getElementsByTagName('servings');
          let kh_gram = data[0].getElementsByTagName('kh_gram');
          value100 = kh_gram[0].textContent;
          this.valueCarbo = value100;
          this.valuePort = 100;

          console.log('FDDB: ' + value100 + ', ' + valuePort)
          this.showDataDetails();
          //this.carboValues.push();
        } catch (Error) {
          alert("no data in fddb available");
        }


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
  getDataFromOpenFood(barcode) {
    //barcode = 7613331209962;
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
        let valueCarboPort;
        let valueCarbo100;
        let desc;
        try {
          //description of the nutrition
          desc = art.data[0].display_name_translations.de;
          this.desc = desc;
          console.log('description: ' + this.desc);
          //carbohydrates per 100g
          valueCarbo100 = art.data[0].nutrients.carbohydrates.per_hundred;
          this.valueCarbo = valueCarbo100;
          this.valuePort = 100;
          this.carboValues100.push(valueCarbo100);
          //carbohydrates per portion
          valueCarboPort = art.data[0].nutrients.carbohydrates.per_portion;
          this.valueCarbo = valueCarboPort;
          this.valuePort = art.data[0].portion_quantity;
          //    this.valuePort = 100;
          console.log('Open Food: ' + valueCarbo100 + ', ' + valueCarboPort);
          this.showDataDetails();
        } catch (Error) {
          if (this.valueCarbo == null) {
            alert("no data in open food available");
            this.getDataFromFDDB(barcode);
          }
        }

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
  getDataFromOpenFoodFacts(barcode) {
    let code = barcode;
    var xhr = new XMLHttpRequest();
    var method = 'GET';
    var url = "https://world.openfoodfacts.org/api/v0/product/" + code + ".json";
    console.log('url: ' + url);

    xhr.open(method, url);
    console.log(xhr);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        let art = JSON.parse(xhr.responseText);
        console.log(art);
        let valuePort;
        let value100;
        let desc;
        try {
          desc = art.product.product_name_de;
          this.desc = desc;
          value100 = art.product.nutriments.carbohydrates_100g;
          this.valueCarbo = value100;
          this.valuePort = 100;
          this.carboValues100.push(value100);
          valuePort = art.product.nutriments.carbohydrates_serving;
          this.valueCarbo = valuePort;

          //    this.valuePort = 100;
          console.log('Open Food Facts: ' + value100 + ', ' + valuePort)
          this.showDataDetails();
        } catch (Error) {
          if (this.valueCarbo == null) {
            alert("no data in open food fact available");
            this.getDataFromOpenFood(barcode);
          }
        }
        //if not ready
      } else if (xhr.readyState != XMLHttpRequest.DONE && xhr.status === 200) {
        console.log("XMLHTTPRequest not ready");
        //if bad authorization
      } else {
        console.log("Error from XMLHTTPRequest: NOT Status = 200");
      }
    }
    xhr.send();
  }
}
