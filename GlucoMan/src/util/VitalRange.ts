
import { MeasurementsPage } from '../pages/measurements/measurements';

/**************************************************
Class Chart
creates the single charts of the MeasurementsPage, called by measurements.ts

**************************************************/

export class VitalRange {

  vitalRange: any;
  title: any;
  lowerLimit: any;
  upperLimit: any;
  unit: any;
  date: any;
  constructor(title: any, lower: any, upper: any, unit: any, date: any) {
    this.vitalRange = {
      title: title,
      lowerLimit: lower,
      upperLimit: upper,
      unit: unit,
      date: date
    }
  }
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
  public setLowerLimit(lowerLimit) {
    this.lowerLimit = lowerLimit;
  }
  //get-method
    public getUpperLimit() {
      return this.upperLimit;
    }
    //set-method
    public setUpperLimit(upperLimit) {
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
}
