
import { MeasurementsPage } from '../pages/measurements/measurements';

/**************************************************

**************************************************/

export class VitalRange {

  //vitalRange: any;
  title: any;
  lowerLimit: number;
  upperLimit: number;
  unit: any;
  date: any;
  changeFlag: boolean = false;

  constructor(title: any, lower: number, upper: number, unit: any, date: any) {

      this.title = title;
      this.lowerLimit = lower;
      this.upperLimit = upper;
      this.unit = unit;
      this.date = date;

  }
}
