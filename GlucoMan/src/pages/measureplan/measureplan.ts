import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Measureplan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-measureplan',
  templateUrl: 'measureplan.html'
})
export class MeasureplanPage {

  arrayValues: [[string]];
  arrayIndividualValues: [[string]];
  arrayLowValues: [[string]];
  arrayMediumValues: [[string]];
  arrayHighValues: [[string]];
  actualValues: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    this.storage.ready().then(() => {

      this.storage.get('schemaIndividual').then((val) => {
        if(val == undefined) {
          console.log("undefined values");
          this.arrayIndividualValues = [["Mo","","","","","","",""],
                                      ["Di","","","","","","",""],
                                      ["Mi","","","","","","",""],
                                      ["Do","","","","","","",""],
                                      ["Fr","","","","","","",""],
                                      ["Sa","","","","","","",""],
                                      ["So","","","","","","",""],
                                      ["-3","","","","","","",""],
                                      ["-2","","","","","","",""],
                                      ["-1","","","","","","",""]];
        } else {
          console.log("defined values");
          this.arrayIndividualValues = val;
        }
        this.setIndividualValues();
      });
    });


    this.arrayLowValues = [["Mo","X","X","","","","",""],
                          ["Di","","","","","","",""],
                          ["Mi","","","X","X","","",""],
                          ["Do","","","","","","",""],
                          ["Fr","","","","","","",""],
                          ["Sa","","","","","X","X",""],
                          ["So","","","","","","",""],
                          ["-3","X","(X)","X","(X)","X","(X)","X"],
                          ["-2","X","(X)","X","(X)","X","(X)","X"],
                          ["-1","X","X","X","X","X","X","X"]];

    this.arrayMediumValues = [["Mo","X","","X","","X","","X"],
                            ["Di","X","","X","","X","","X"],
                            ["Mi","X","(X)","X","","X","","X"],
                            ["Do","X","","X","","X","","X"],
                            ["Fr","X","","X","","X","","X"],
                            ["Sa","X","","X","","X","(X)","X"],
                            ["So","X","","X","","X","","X"]];

    this.arrayHighValues = [["Mo","X","X","X","","X","X","X"],
                          ["Di","X","","X","X","X","","X"],
                          ["Mi","X","","X","","X","X","X"],
                          ["Do","X","X","X","X","X","X","X"],
                          ["Fr","X","X","X","","X","","X"],
                          ["Sa","X","","X","X","X","","X"],
                          ["So","X","","X","","X","X","X"]];

    this.setLowValues();
  }

  toogleValue(x:any, y:number) {
    if(this.actualValues === "Individual") {

      if(x[y] === "") {
        console.log("set to X");
        x[y] = "X";
      } else if(x[y] === "X") {
        console.log("set to (X)");
        x[y] = "(X)";
      } else {
        console.log("set to empty");
        x[y] = "";
      }

      this.saveIndividualValues();
    }
  }

  setIndividualValues() {
    this.actualValues = "Individual";
    this.arrayValues = this.arrayIndividualValues;
  }

  saveIndividualValues() {
    this.storage.ready().then(() => {
      this.storage.set('schemaIndividual', this.arrayIndividualValues);
    });
  }

  setLowValues() {
    this.actualValues = "Low";
    this.arrayValues = this.arrayLowValues;
  }

  setMediumValues() {
    this.actualValues = "Medium";
    this.arrayValues = this.arrayMediumValues;
  }

  setHighValues() {
    this.actualValues = "High";
    this.arrayValues = this.arrayHighValues;
  }
}
