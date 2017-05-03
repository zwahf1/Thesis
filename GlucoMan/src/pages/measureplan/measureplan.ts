import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  arrayValues: string[][];
  arrayValuesBefore: string[][];
  aValBefore: boolean = false;
  actualSchema: string;

  arrayIndividualValues: string[][];
  arrayIndividualValuesBefore: string[][];

  arrayLowValues = [
    ["Mo", "X", "X", "", "", "", "", ""],
    ["Di", "", "", "", "", "", "", ""],
    ["Mi", "", "", "X", "X", "", "", ""],
    ["Do", "", "", "", "", "", "", ""],
    ["Fr", "", "", "", "", "", "", ""],
    ["Sa", "", "", "", "", "X", "X", ""],
    ["So", "", "", "", "", "", "", ""]
  ];
  arrayLowValuesBefore = [
    ["-3", "X", "(X)", "X", "(X)", "X", "(X)", "X"],
    ["-2", "X", "(X)", "X", "(X)", "X", "(X)", "X"],
    ["-1", "X", "X", "X", "X", "X", "X", "X"]
  ];
  arrayMediumValues = [
    ["Mo", "X", "", "X", "", "X", "", "X"],
    ["Di", "X", "", "X", "", "X", "", "X"],
    ["Mi", "X", "(X)", "X", "", "X", "", "X"],
    ["Do", "X", "", "X", "", "X", "", "X"],
    ["Fr", "X", "", "X", "", "X", "", "X"],
    ["Sa", "X", "", "X", "", "X", "(X)", "X"],
    ["So", "X", "", "X", "", "X", "", "X"]
  ];
  arrayHighValues = [
    ["Mo", "X", "X", "X", "", "X", "X", "X"],
    ["Di", "X", "", "X", "X", "X", "", "X"],
    ["Mi", "X", "", "X", "", "X", "X", "X"],
    ["Do", "X", "X", "X", "X", "X", "X", "X"],
    ["Fr", "X", "X", "X", "", "X", "", "X"],
    ["Sa", "X", "", "X", "X", "X", "", "X"],
    ["So", "X", "", "X", "", "X", "X", "X"]
  ];

  constructor(public navCtrl: NavController, public storage: Storage) {
    this.storage.ready().then(() => {
      this.storage.get('schemaIndividual').then((val) => {
        if (val == undefined) {
          this.arrayIndividualValues = [["Mo", "", "", "", "", "", "", ""],
            ["Di", "", "", "", "", "", "", ""],
            ["Mi", "", "", "", "", "", "", ""],
            ["Do", "", "", "", "", "", "", ""],
            ["Fr", "", "", "", "", "", "", ""],
            ["Sa", "", "", "", "", "", "", ""],
            ["So", "", "", "", "", "", "", ""]];
        } else {
          this.arrayIndividualValues = val;
        }
      });
      this.storage.get('schemaIndividualBefore').then((val) => {
        if (val == undefined) {
          this.arrayIndividualValuesBefore = [
            ["-3", "", "", "", "", "", "", ""],
            ["-2", "", "", "", "", "", "", ""],
            ["-1", "", "", "", "", "", "", ""]];
        } else {
          this.arrayIndividualValuesBefore = val;
        }
      });
      this.storage.get('Schema').then((val) => {
        if (val) {
          this.actualSchema = val;
        //  this.loadSchema(this.actualSchema);
        } else {
          this.actualSchema = 'Individuell';
          this.aValBefore = true;
        //  this.loadSchema(this.actualSchema);
        }
        this.loadSchema(this.actualSchema);
      });
    });
  }

  loadSchema(schema){
    switch (schema) {
      case 'Individuell':
        this.setIndividualValues();
        break;
      case 'Tief':
        this.setLowValues();
        break;
      case 'Mittel':
        this.setMediumValues();
        break;
      case 'Hoch':
        this.setHighValues();
        break;
      default:
        this.setIndividualValues();
    }
  }

  toogleValue(x: any, y: number) {
    if (this.actualSchema === "Individuell") {

      if (x[y] === "") {
        x[y] = "X";
      } else if (x[y] === "X") {
        x[y] = "(X)";
      } else {
        x[y] = "";
      }
      this.saveIndividualValues();
    }
  }

  setIndividualValues() {
    //  this.actualSchema = "Individual";
    this.arrayValues = this.arrayIndividualValues;
    this.arrayValuesBefore = this.arrayIndividualValuesBefore;
    this.aValBefore = true;
  }

  saveIndividualValues() {
    this.storage.ready().then(() => {
      this.storage.set('schemaIndividual', this.arrayIndividualValues);
      this.storage.set('schemaIndividualBefore', this.arrayIndividualValuesBefore);
    });
  }

  setLowValues() {
    //  this.actualSchema = "Low";
    this.arrayValues = this.arrayLowValues;
    this.arrayValuesBefore = this.arrayLowValuesBefore;
    this.aValBefore = true;
  }

  setMediumValues() {
    //    this.actualSchema = "Medium";
    this.arrayValues = this.arrayMediumValues;
    this.aValBefore = false;
  }

  setHighValues() {
    //  this.actualSchema = "High";
    this.arrayValues = this.arrayHighValues;
    this.aValBefore = false;
  }
}
