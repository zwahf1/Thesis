import { Component } from '@angular/core';
import { DayNutrition } from '../../util/DayNutrition';
import { DetailNutrition } from '../../util/DetailNutrition';
import { Platform, NavController, AlertController, ActionSheetController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova: any;
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html'
})
export class NutritionPage {

  //list with all nutrition of one day with, divided per time of day
  nutritionList: DayNutrition[] = [];
  //list with all nutrition per time of day, divided per date
  nutritionTimeOfDayList: any[][];
  //list with every single nutrition
  nutritionDetailList: DetailNutrition[] = [];
  //variable to store temporal portion quantity
  valuePort: any;
  //variable to store temporal carbo value
  valueCarbo: any;
  //variable to store temporal description of the nutrition
  desc: any;
  //options of the carbohydrates chart of the NutritionPage
  chartCarbo: any;

  /**
                    constructor NutritionPage

  create the nutrition page with parameters
    - navCtrl: navigation controller to navigate between pages
    - platform: platform for using plugins
    - storage: local storage
    - alertCtrl: alert controller to handle alerts (popups)

  storage SET:
    - nutritionDetailList: list with all nutritions and dates

  If there's a value in storage, create the nutritionList.
  createNutritionList() invokes createTimeOfDayList(), that creates
  lists of all days per time of day.
  createTimeOfDayList() invokes createNutritionChart(), that creates
  the stacked column chart of the NutritionPage.
  **/
  constructor(public navCtrl: NavController, public platform: Platform, public storage: Storage, public alertCtrl: AlertController, public actionCtrl: ActionSheetController) {
    this.storage.ready().then(() => {
      this.storage.get('NutritionDetailList').then((val) => {
        //if there's a value in 'NutritionDetailList', load it to local variable
        if (val) {
          this.nutritionDetailList = val;
          //after list is loaded, create daily nutrition list
          this.createNutritionList();
        }
      })
    });
  }

  /**
  invoke createNutritionList() after view did enter
  **/
  ionViewDidEnter() {
    this.createNutritionList();
  }

  /**
  invoke createNutritionList() after slide changed
  **/
  slideChanged() {
    this.createNutritionList();
  }
  /**
  create nutrition list from nutritionDetailList
  **/
  createNutritionList() {
    this.nutritionList = [];
    //for each entry of nutritionDetailList
    for (let entry of this.nutritionDetailList) {
      //date of the current entry
      let dateEntry = entry.date;
      //variable for last date in nutritionList, default 0, so it isn't the same day
      let dateLastInList = new Date(0);
      //if there's a date, load it to local variable, ortherwise it stays the default date
      try {
        dateLastInList = this.nutritionList[this.nutritionList.length - 1][0];
      } catch (Error) {
      }
      //calculate the difference between the two dates
      let diffDate = dateEntry.getTime() - dateLastInList.getTime();
      //timeOfDay is the value of 24h in milliseconds
      let timeOfDay = 86400000;

      //if the different of the two dates are bigger than 24h, so push a new entry
      //to the list and set the date
      if (dateEntry.getDate() != dateLastInList.getDate() && Math.abs(diffDate) < timeOfDay || (Math.abs(diffDate) > timeOfDay)) {
        this.nutritionList.push(new DayNutrition);
        this.nutritionList[this.nutritionList.length - 1][0] = entry.date;
      }
      //if the two dates have not the same day and the different is lower than 24h,
      //do the same as above
      /*
            else if (dateEntry.getDate() != dateLastInList.getDate() && Math.abs(diffDate) < timeOfDay) {
              this.nutritionList.push(new DayNutrition);
              this.nutritionList[this.nutritionList.length - 1][0] = entry.date;
            }
      */
      //local variable tempCarb for current carb value of the time of day of the entry, default = 0
      let tempCarb: number = 0
      tempCarb = this.nutritionList[this.nutritionList.length - 1][this.getTimeOfDay(entry.date)];
      //add the tempCarb and carb value of the entry and load it to the list
      this.nutritionList[this.nutritionList.length - 1][this.getTimeOfDay(entry.date)] = (parseInt('' + entry.carb) + parseInt('' + tempCarb));
      //after creating the list, create the list specific for the times of day
      this.createTimeOfDayList();
    }
  }

  /**
  this method returns the index of the time of day of a given date.

  index 0 for nigth: 22:00-03:59
  index 1 for morning: 4:00-08:59
  index 2 for forenoon: 9:00-10:59
  index 3 for midday: 11:00-13:59
  index 4 for afternoon: 14:00-16:59
  index 5 for evening: 17:00-21:59
  **/
  getTimeOfDay(date: Date) {

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
  /**
    create nutritionTimeOfDayList from nutritionList

  list includes 6 arrays, for every time of day one.
  this is needed for creating the chart.
  **/
  createTimeOfDayList() {
    //initialize the nutritionTimeOfDayList with 6 empty arrays
    this.nutritionTimeOfDayList = [[], [], [], [], [], []];
    //for-loop for every entry of the nutritionList
    for (let entry of this.nutritionList) {
      //clone the date of the current entry
      let date = new Date(entry[0].getTime());
      //set the time to 0. Cause the time zone, hours has an offset of 2
      date.setHours(2);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      //for-loop for every time of day
      for (let i = 0; i < 6; i++) {
        //load the value of the entry of the i-th time of day to the list if there's a value
        if (entry[(i + 1)] > 0) {
          this.nutritionTimeOfDayList[i].push([date.getTime(), entry[(i + 1)]]);
        }
      }
    }
    //after the nutritionTimeOfDayList is filled, the chart has to be created
    this.createNutritionChart();
  }

  /**
  create nutrition chart from nutritionTimeOfDayList

  it's a column chart
  **/
  createNutritionChart() {
    this.chartCarbo = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: 'column',
        //the height is fixed because of the rotation of the smartphone
        height: 300,
        //width is null, so it fits to the window
        width: window.innerWidth,
      //  marginRight: 10,
        resetZoomButton: {
          position: {
            verticalAlign: 'bottom', // by default
            y: -35,
          },
          relativeTo: 'plot'
        },
      },
      //credits are disabled, default is enabled
      credtis: {
        enabled: false,
      },
      //title isn't set, it's set directly in html with <h2>-tag
      title: {
        text: null,
      },
      //the lables in the x-axis are the dates of the nutrition
      xAxis: {
        type: 'datetime'
      },
      //on the y-axis, the unit is shown and it starts on zero. with opposite = false,
      //the y-axis is on the right side
      yAxis: {
        title: {
          text: 'Kohlenhydrate in Gramm',
        },
        min: 0,
        opposite: true,
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
      //the titles of the series are the time of days, the values are given from nutritionTimeOfDayList
      series: [{
        name: 'Morgen',
        data: this.nutritionTimeOfDayList[0],
      }, {
          name: 'Znüni',
          data: this.nutritionTimeOfDayList[1],
        }, {
          name: 'Mittag',
          data: this.nutritionTimeOfDayList[2],
        }, {
          name: 'Zvieri',
          data: this.nutritionTimeOfDayList[3],
        }, {
          name: 'Abend',
          data: this.nutritionTimeOfDayList[4],
        }, {
          name: 'Nacht',
          data: this.nutritionTimeOfDayList[5],
        }]
    };
  }
  /**
  open an action sheet to choose an entry with barcode
  or a manually entry.
  **/
  openActionSheet() {
    let actionSheet = this.actionCtrl.create({});
    actionSheet.setTitle('Neuer Eintrag');
    actionSheet.addButton({
      text: 'Scannen',
      icon: 'barcode',
      handler: () => {
        this.scan();
      }
    });
    actionSheet.addButton({
      text: 'Manuelle Eingabe',
      icon: 'create',
      handler: () => {
        this.showDataDetails();
      }
    });
    actionSheet.addButton({
      text: 'Cancel',
      icon: 'close',
      role: 'destructive'
    });

    // present the alert popup
    actionSheet.present();
  }
  /**
    scan method to import the values of a nutriiton
    from an online database.

    the result of the barcodeScanner is shown for 50 ms.
    the orientation of the camera doesn't rotate, it's fixed to portrait

    1. priority: Open Food Facts
    2. priority: Open Food
    3. priority: FDDB

  **/
  scan() {
    //plugin barcodeScanner to get the text of a printed barcode
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        //if scan was successfull, try to import from Open Food Facts as 1. priority
        if (result.text) {
          try {
            this.getDataFromOpenFoodFacts(result.text);
          } catch (Error) {
            alert("no data found");
          }
        }
      },
        function(error) {
          alert("Scanning failed: " + error);
        }, {
          resultDisplayDuration: 50,
          orientation: "portrait",
        }
      );
    });
  }
  /**
  get the nutrition information from Open Food Facts
  1. priority

  the method loads the carbohydrates value and portion quantity
  from the database Open Food Facts.
  **/
  getDataFromOpenFoodFacts(barcode) {
    let code = barcode;
    //create XMLHttp request to get the product information
    var xhr = new XMLHttpRequest();
    var method = 'GET';
    var url = "https://world.openfoodfacts.org/api/v0/product/" + code + ".json";
    //open the request for import
    xhr.open(method, url);
    //if the request is done and the authorization was successfull
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //response of the http request
        let art = JSON.parse(xhr.responseText);
        //try to get product information, otherwise try with the database Open Food
        try {
          //if there's a description of the product, store it
          if (art.product.product_name) {
            this.desc = art.product.product_name;
          }
          //if there's a german description, overwrite the description
          if (art.product.product_name_de) {
            this.desc = art.product.product_name_de;
          }
          //store the values per 100 gram
          this.valueCarbo = art.product.nutriments.carbohydrates_100g;
          this.valuePort = 100;
          //overwrite the portion and carbohydrates values, if there are information about the serving portion
          this.valueCarbo = art.product.nutriments.carbohydrates_serving;
          this.valuePort = art.product.serving_quantity;
          if (this.valueCarbo == null || this.valueCarbo == undefined || this.valueCarbo <= 0) {
            this.getDataFromOpenFood(barcode);
          } else {
            //otherwise show the details in an alert
            this.showDataDetails();
          }
        } catch (Error) {
          //if it's catched before a carbohydrates value is found, try with Open Food
          if (this.valueCarbo == null || this.valueCarbo == undefined || this.valueCarbo <= 0) {
            this.getDataFromOpenFood(barcode);
          } else {
            //otherwise show the details in an alert
            this.showDataDetails();
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
    //send the request
    xhr.send();
  }
  /**
  get the nutrition information from Open Food
  2. priority

  the method loads the carbohydrates value and portion quantity
  from the database Open Food.
  **/
  getDataFromOpenFood(barcode) {
    //set the key for the API of Open Food
    let key = 'e30f2ff2fdc37588275626f176966ea6';
    let code = barcode;
    //create XMLHttp request to get the product information
    var xhr = new XMLHttpRequest();
    var method = "GET";
    //set the authorization header
    var reqHeaders = 'Token token="' + key + '"';
    var url = "https://www.openfood.ch/api/v3/products?barcodes=" + code + "&api_key=" + key;
    //open request for import
    xhr.open(method, url);
    //set the request header with coded credentials
    xhr.setRequestHeader("Authorization", reqHeaders);
    //if the request is done and the authorization was successfull
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //response of the http request
        let art = JSON.parse(xhr.responseText);
        try {
          //description of the nutrition
          this.desc = art.data[0].display_name_translations.de;
          //store the values of 100 gram
          this.valueCarbo = art.data[0].nutrients.carbohydrates.per_hundred;
          this.valuePort = 100;
          //overwrite the values of 100 gram with values per portion
          this.valueCarbo = art.data[0].nutrients.carbohydrates.per_portion;
          this.valuePort = art.data[0].portion_quantity;
          if (this.valueCarbo == null || this.valueCarbo == undefined || this.valueCarbo <= 0) {
            this.getDataFromFDDB(barcode);
          } else {
            //otherwise show the details in an alert
            this.showDataDetails();
          }
        } catch (Error) {
          //if it's catched before a carbohydrates value is found, try with FDDB
          if (this.valueCarbo == null) {
            this.getDataFromFDDB(barcode);
          } else {
            //otherwise show the details in an alert
            this.showDataDetails();
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
  /**
  get the nutrition information from FDDB
  3. priority

  the method loads the carbohydrates value and portion quantity
  from the database FDDB.
  **/
  getDataFromFDDB(barcode) {
    //set the API key
    let key = 'ZPAQGQY9Q75GHB2593R7V911';
    //creates XMLHttp request to get the nutrition information
    var xhr = new XMLHttpRequest();
    var method = "GET";
    var url = "http://fddb.info/api/v17/search/item.xml?q=" + barcode + "&apikey=" + key + "&lang=de";
    //open the request for import
    xhr.open(method, url);
    //if the request is done
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //response of the http request
        let xml = xhr.responseXML;
        try {
          //results of the mentioned nutrition
          let result = xml.getElementsByTagName("result")[0].getElementsByTagName("items")[0].getElementsByTagName('item');
          //navigate to the value of carbohydrates of 100 gram and store it to the variable
          let kh_gram = result[0].getElementsByTagName('data')[0].getElementsByTagName('kh_gram')[0].textContent;
          this.valueCarbo = kh_gram;
          this.valuePort = 100;
          //navigate to the value of a portion and store it to the variable
          let weight_gram = result[0].getElementsByTagName('servings')[0].getElementsByTagName('serving')[1].getElementsByTagName('weight_gram')[0].textContent;
          this.valueCarbo = (kh_gram / 100 * weight_gram);
          this.valuePort = weight_gram;
          //navigate to the description of the product and store it to the variable
          let description = result[0].getElementsByTagName('description');
          let name = description[0].getElementsByTagName('name')[0].textContent;
          this.desc = name;
        } catch (Error) {
          alert("no data in fddb available");
        } finally {
          this.showDataDetails();
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
  /**
  alert with all details with the imported product information
  or with empty fields to add a nutrition.

  the alert shows three input fields, for description,
  portion quantity and carbohydrate value.
  there are three buttons:
  -to calculate the new carbo value based on the portion quantity.
  -to cancel the alert
  -to confirm and insert the new nutrition
  **/
  showDataDetails() {
    //create alert to customize nutrition information
    let alert = this.alertCtrl.create({});
    // set title of the alert
    alert.setTitle("Details eingeben");
    alert.setCssClass("dataDetails");
    //add input fields for the description, portion quantity and carbohydrate value
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
      value: this.valuePort,
    });
    alert.addInput({
      type: 'number',
      label: 'Kohlenhydrate',
      name: 'carbo',
      value: this.valueCarbo
    });
    // button to calculate the carbohydrate value
    alert.addButton({
      text: 'berechnen',
      handler: (data) => {
        this.valueCarbo = Math.round((this.valueCarbo / this.valuePort * data.port) * 100) / 100;
        this.valuePort = data.port;
        this.showDataDetails();
      }
    });
    // button to cancel
    alert.addButton('Cancel');
    // button to save nutrition
    alert.addButton({
      text: 'Ok',
      //handle the click event for the OK button
      //the typed values store into variables of NutritionPage
      handler: (data) => {
        this.desc = data.desc;
        this.valuePort = data.port;
        this.valueCarbo = data.carbo;
        //create new nutrition
        this.newNutrition();
      }
    });
    // present the alert popup
    alert.present();
    //after presented the alert, close the keyboard (after 0.3 seconds)
    setTimeout(() => {
      cordova.plugins.Keyboard.close();
    }, 300);
  }
  /**
  insert nutrition into nutritionDetailList and set the
  variables of the page to null.
  afterwards store the list to the storage and create the nutrition overview.
  **/
  newNutrition() {
    this.nutritionDetailList.push(new DetailNutrition(this.desc, this.valuePort, this.valueCarbo));
    //the variables desc for description, valuePort for the portion and
    //valueCarbo for carbohydrates are set to null.
    this.desc = null;
    this.valuePort = null;
    this.valueCarbo = null;
    this.saveDetailList();
    this.createNutritionList();
  }
  /**
  method to edit or remove a clicked entry of the nutritionDetailList
  **/
  edit(item) {
    let alert = this.alertCtrl.create({});
    // set title of popup
    alert.setTitle("Details eingeben");
    alert.setCssClass("dataDetails");
    //add input fields for the description, portion quantity and carbohydrate value
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
    alert.addInput({
      type: 'number',
      label: 'Kohlenhydrate',
      name: 'carb',
      value: item.carb
    });
    // button to cancel
    alert.addButton('Cancel');
    // button to remove the item
    alert.addButton({
      text: 'Löschen',
      //handle to remove an entry
      handler: (data) => {
        let index: number = this.nutritionDetailList.indexOf(item);
        if (index !== -1) {
          this.nutritionDetailList.splice(index, 1);
        }
      }
    });
    // button to confirm the editing
    alert.addButton({
      text: 'Ok',
      //handle the edited data
      //replace the item in the detail list and store it
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
    //after presented the alert, close the keyboard (after 0.3 seconds)
    setTimeout(() => {
      cordova.plugins.Keyboard.close();
    }, 300);
  }
  /**
  store the detail list to the storage as NutritionDetailList
  **/
  saveDetailList() {
    this.storage.ready().then(() => {
      this.storage.set('NutritionDetailList', this.nutritionDetailList);
      console.log('saved in storage as NutritionDetailList');
    });
  }
  /**
  method to hide and show the chart container.
  it sets the property 'display' to none or inline
  **/
  expand(src) {
    //source navigate to the chart tag and store it to 'element'
    let element = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('chart')[0];
    //mode is the style attribute of the chart element
    let mode = '' + element.getAttribute('style');
    //if 'style' contains the word 'none', the method 'search' returns a positive value, otherwise -1

    if (mode.search('none') < 0) {
      //the attribute 'display' is set to none to hide the chart
      element.style.display = 'none';
    } else if (mode.search('none') > 0) {
      //the attribute 'display' is set to inline to show the chart
      element.style.display = 'inline';
    }
  }

}
