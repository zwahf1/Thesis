import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * measureplan page for home page
 * @param  {'page-measureplan'}  {selector   [description]
 * @param  {'measureplan.html'}} templateUrl [description]
 * @return {[type]}                          [description]
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

  /**
   * get the actual selected schema and individual schema from storage if saved
   * otherwise load empty and default schema
   * @param  {NavController} publicnavCtrl navigation of app
   * @param  {Storage}       publicstorage ionic storage of phone
   */
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
        } else {
          this.actualSchema = 'Individuell';
          this.aValBefore = true;
        }
        this.loadSchema(this.actualSchema);
      });
    });
  }

  /**
   * load the given schema into the page
   * @param  {string} schema schema to show | Individuell, Tief, Mittel, Hoch
   */
  loadSchema(schema: string){
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

  /**
   * toggle the clicked grid field in the schema from given array and position
   * only possible if schema individual is selectes
   * if clicked
   * first: X | second: (X) | third: 'empty'
   * @param  {any}    x array from schema value array
   * @param  {number} y field position in the array
   */
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

  /**
   * set the actual schema to individual
   */
  setIndividualValues() {
    this.arrayValues = this.arrayIndividualValues;
    this.arrayValuesBefore = this.arrayIndividualValuesBefore;
    this.aValBefore = true;
  }

  /**
   * set the actual schema to low
   */
  setLowValues() {
    this.arrayValues = this.arrayLowValues;
    this.arrayValuesBefore = this.arrayLowValuesBefore;
    this.aValBefore = true;
  }

  /**
   * set the actual schema to medium
   */
  setMediumValues() {
    this.arrayValues = this.arrayMediumValues;
    this.aValBefore = false;
  }

  /**
   * set the actual schema to high
   */
  setHighValues() {
    this.arrayValues = this.arrayHighValues;
    this.aValBefore = false;
  }

  /**
   * save the individual values to storage
   */
  saveIndividualValues() {
    this.storage.ready().then(() => {
      this.storage.set('schemaIndividual', this.arrayIndividualValues);
      this.storage.set('schemaIndividualBefore', this.arrayIndividualValuesBefore);
    });
  }
}
