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
  nutritionDaytimeList: any[][];
  nutritionDetailList: DetailNutrition[] = [];
  carboValuesPort: number[] = [];
  carboValues100: number[] = [];
  valuePort: any;
  valueCarbo: any;
  desc: any;
  chartCarbo: any;

  /**************************************************
  sample data for glucose, blood pressure, pulse and weight
  **************************************************/
  valuesGlucose = [{ 4: Date.UTC(2016, 3, 4), 1: 2 }, { 0: Date.UTC(2016, 3, 5), 1: 4 }, { 0: Date.UTC(2016, 3, 7), 1: 6 }, { 0: Date.UTC(2016, 3, 8), 1: 8 },
    { 0: Date.UTC(2016, 3, 9), 1: 10 }, { 0: Date.UTC(2016, 3, 11), 1: 9 }, { 0: Date.UTC(2016, 3, 12), 1: 8 }, { 0: Date.UTC(2016, 3, 14), 1: 9 },
    { 0: Date.UTC(2016, 3, 17), 1: 10 }, { 0: Date.UTC(2016, 3, 18), 1: 11 }];


  valuesBP = [[Date.UTC(2016, 3, 4), 71, 132], [Date.UTC(2016, 3, 5), 62, 124], [Date.UTC(2016, 3, 7), 73, 126], [Date.UTC(2016, 3, 8), 54, 118],
    [Date.UTC(2016, 3, 9), 65, 110], [Date.UTC(2016, 3, 11), 66, 119], [Date.UTC(2016, 3, 12), 57, 128], [Date.UTC(2016, 3, 14), 68, 129],
    [Date.UTC(2016, 3, 17), 79, 130], [Date.UTC(2016, 3, 18), 60, 121]];

  valuesPulse = [[Date.UTC(2016, 3, 4), 66], [Date.UTC(2016, 3, 5), 77], [Date.UTC(2016, 3, 7), 65], [Date.UTC(2016, 3, 8), 61],
    [Date.UTC(2016, 3, 9), 62], [Date.UTC(2016, 3, 11), 75], [Date.UTC(2016, 3, 12), 83], [Date.UTC(2016, 3, 14), 59],
    [Date.UTC(2016, 3, 17), 65], [Date.UTC(2016, 3, 18), 73]];

  valuesWeight = [[Date.UTC(2016, 3, 4), 76.5], [Date.UTC(2016, 3, 5), 77.6], [Date.UTC(2016, 3, 7), 75.0], [Date.UTC(2016, 3, 8), 76.3],
    [Date.UTC(2016, 3, 9), 76.7], [Date.UTC(2016, 3, 11), 77.5], [Date.UTC(2016, 3, 12), 77.8], [Date.UTC(2016, 3, 14), 78.1],
    [Date.UTC(2016, 3, 17), 74.9], [Date.UTC(2016, 3, 18), 75.7]];


  constructor(public navCtrl: NavController, public platform: Platform,
    public storage: Storage, public alertCtrl: AlertController) {
    this.storage.ready().then(() => {
      this.storage.get('NutritionDetailList').then((val) => {
        if (val) {
          this.nutritionDetailList = val;
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

  createDaytimeList() {
    this.nutritionDaytimeList = [[], [], [], [], [], []];
    for (let entry of this.nutritionList) {

      let date = new Date(entry[0].getTime());
      //.setTime(entry[0].getTime());
      date.setHours(2);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      for (let i = 0; i < 6; i++) {
        if (entry[(i + 1)] > 0) {
          this.nutritionDaytimeList[i].push([date.getTime(), entry[(i + 1)]]);
        }
      }
    }
    console.log('created Datime List');
    console.log(this.nutritionDaytimeList[2]);
    console.log(this.valuesWeight);
    this.createNutritionChart();
  }

  saveDetailList() {
    this.storage.ready().then(() => {
      this.storage.set('NutritionDetailList', this.nutritionDetailList);
      console.log('saved in storage as NutritionDetailList');
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
      console.log(entry);
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

      //if the different of the two dates are bigger than 24h
      if ((Math.abs(diffDate) > timeOfDay)) {
        this.nutritionList.push(new DayNutrition);
        this.nutritionList[this.nutritionList.length - 1][0] = entry.date;
      }
      //if the two dates don't have the same day and different is lower than 24h
      else if (dateEntry.getDate() != dateLastInList.getDate() && Math.abs(diffDate) < timeOfDay) {
        this.nutritionList.push(new DayNutrition);
        this.nutritionList[this.nutritionList.length - 1][0] = entry.date;
      }
      let tempCarb: number = 0
      tempCarb = this.nutritionList[this.nutritionList.length - 1][this.getDayTime(entry.date)];
      /*      if (!(tempCarb > 0)) {
              tempCarb = 0;
            }
            */
      this.nutritionList[this.nutritionList.length - 1][this.getDayTime(entry.date)] = (parseInt('' + entry.carb) + parseInt('' + tempCarb));
      this.createDaytimeList();
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

  createNutritionChart() {
    this.chartCarbo = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: 'column',
        //the height is fixed because of the rotation of the smartphone
        height: 300,
        width: null,
        marginRight: 70
      },
      //credits are disabled, default is enabled
      credtis: {
        enabled: false,
      },
      //title isn't set, it's set directly in html with <h2>-tag
      title: {
        text: null,
      },
      //the lables in the x-axis are the dates of the measurements
      xAxis: {
        type: 'datetime'
      },
      //on the y-axis, the unit is shown and it starts on zero. with opposite = false,
      //the y-axis is on the right side
      yAxis: {
        title: {
          text: 'g',
          //rotation: -90,
        },
        min: 0,
        opposite: true,
        /*
        plotBands: [{
          from: 0,
          to: 0,
          color: 'lightgreen',
        },{
          from: 0,
          to: 0,
          color: 'lightgreen',
        }]
        */
      },

      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        valueSuffix: ' g',
        followTouchMove: false,
        followPointer: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        }
      },
      //navigator, range selector and scrollbar aren't visible - reason of usability
      navigator: {
        enabled: false
      },
      rangeSelector: {
        selected: 1,
        enabled: false,
      },
      scrollbar: {
        enabled: false,
        liveRedraw: false
      },
      //the legend isn't visible, so the user can't disable e serie of data
      legend: {
        enabled: false
      },
      //the title of the serie is given from MeasurementsPage, also the data
      series: [{
        name: 'Morgen',
        data: this.nutritionDaytimeList[0],
      }, {
          name: 'Znüni',
          data: this.nutritionDaytimeList[1],
        }, {
          name: 'Mittag',
          data: this.nutritionDaytimeList[2],
        }, {
          name: 'Zvieri',
          data: this.nutritionDaytimeList[3],
        }, {
          name: 'Abend',
          data: this.nutritionDaytimeList[4],
        }, {
          name: 'Nacht',
          data: this.nutritionDaytimeList[5],
        }]
    };
  }

  expand(src) {

    //source navigate to the chart tag and store it to 'element'
    let element = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
    //mode is the style attribute of the chart element
    let mode = ''+element.getAttribute('style');
    //if 'style' contains the word 'none', the method 'search' returns a positive value, otherwise -1

    if (mode.search('none') < 0) {
      //the attribute 'display' is set to none to hide the chart
      element.style.display = 'none';
    } else if (mode.search('none') > 0) {
      //the attribute 'display' is set to inline to show the chart
      element.style.display = 'inline';
    }
  }
  /************************************************************
  this method returns the index of the daytime of a given date.

  index 0 for nigth: 22:00-03:59
  index 1 for morning: 4:00-08:59
  index 2 for forenoon: 9:00-10:59
  index 3 for midday: 11:00-13:59
  index 4 for afternoon: 14:00-16:59
  index 5 for evening: 17:00-21:59
  ************************************************************/
  getDayTime(date: Date) {
    let d = date;

    let h = d.getHours();

    if (h < 4) {
      //if at night
      return 6;
    } else if (h < 9) {
      //if in the morning
      return 1;
    } else if (h < 11) {
      //if ante meridiem
      return 2;
    } else if (h < 14) {
      //if at midday
      return 3;
    } else if (h < 17) {
      //if in the afternoon
      return 4;
    } else if (h < 22) {
      //if in the evening
      return 5;
    } else {
      //if at night
      return 6;
    }
  }
}
