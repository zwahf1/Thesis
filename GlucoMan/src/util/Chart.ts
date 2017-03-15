import { MeasurementsPage } from '../pages/measurements/measurements';
export class Chart {
  chart: any;

  constructor(type: string, title: string, suffix: string, data: any) {
    this.chart = {
      chart: {
        type: type,
        height: 300,
      },
      credtis: {
        enabled: false,
      },
      title: {
        text: '',
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: suffix,
        },
        min: 0,
        opposite: false,
      },
      tooltip: {
        valueSuffix: ' '+suffix,
        followTouchMove: false,
        followPointer: false
      },
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false,
        liveRedraw: false
      },
      rangeSelector: {
        selected: 1,
        enabled: false,
      },
      legend: {
        enabled: false
      },
      series: [{
        name: title,
        data: data,
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 5,
        },

        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }]
    };
    return this.chart;
  }
  public getChart1() {
    return this.chart;
  }
  public setChart1(chart) {
    this.chart = chart;
  }
}
