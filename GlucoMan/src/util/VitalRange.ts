
import { MeasurementsPage } from '../pages/measurements/measurements';

/**************************************************
Class Chart
creates the single charts of the MeasurementsPage, called by measurements.ts

**************************************************/

export class VitalRange {

  //vitalRange: any;
  title: any;
  lowerLimit: number;
  upperLimit: number;
  unit: any;
  date: any;
  visible: any;
  constructor(title: any, lower: number, upper: number, unit: any, date: any, visible: any) {
//    this.vitalRange = {
      this.title = title;
      this.lowerLimit = lower;
      this.upperLimit = upper;
      this.unit = unit;
      this.date = date;
      this.visible = visible;
  //  }
  }
  /*
  //get-method
  public getTitle() {
    return this.title;
  }
  //set-method
  public setTitle(title) {
    this.title = title;
  }
  //get-method
  public getLowerLimit() {
    return this.lowerLimit;
  }
  //set-method
  public setLowerLimit(lowerLimit: number) {
    this.lowerLimit = lowerLimit;
  }
  //get-method
    public getUpperLimit() {
      return this.upperLimit;
    }
    //set-method
    public setUpperLimit(upperLimit: number) {
      this.upperLimit = upperLimit;
    }
    //get-method
    public getDateString() {
      return this.date.getDate()+'.'+this.date.getMonth()+'.'+this.date.getFullYear();
    }
    //set-method
    public setDate(date) {
      this.date = date;
    }
    */
}
