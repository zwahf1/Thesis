
/**************************************************

**************************************************/

export class DetailNutrition {

  //vitalRange: any;
  desc: string;
  date: Date;
  port: number;
  carb: number;

  constructor(desc: string, port: number, carb: number) {
    this.desc = desc;
    this.date = new Date();
    this.port = port;
    this.carb = carb;
  }
}
