
/**************************************************
Class Chart
creates the single charts of the MeasurementsPage, called by measurements.ts

**************************************************/

export class Chart {

  chart: any;
  /**************************************************
                    constructor

input parameters:
    -type (string): gives the type of the chart, usually 'spline' for line- or
    pointchart, 'columnrange' for barchart, e.g. blood pressure
    -title (string): name of the chart
    -suffix (string): unit as suffix, used in tooltip and yAxis
    -data (any): the data to feed the chart
**************************************************/

  constructor(type: string, title: string, unit: string, data: any, from1: number, to1: number, from2: number, to2: number){
    this.chart = {
      chart: {
        //type of the chart. spline for blood glucose, weight and pulse,
        //columnrange for blood pressure
        type: type,
        //the height is fixed because of the rotation of the smartphone
        height: 300,
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
          text: unit,
        },
        min: 0,
        opposite: false,
        plotBands: [{
          from: from1,
          to: to1,
          color: 'lightgreen',
        },{
          from: from2,
          to: to2,
          color: 'lightgreen',
        }]
      },
      //the unit is also shown on the tooltip of each mark.
      //followTouchMove and followPointer has to be disabled to move the chart on touch device
      tooltip: {
        valueSuffix: ' ' + unit,
        followTouchMove: false,
        followPointer: false
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
        name: title,
        data: data,
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 5,
        },
        //if a mark is selected, a thin line is visible
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }]
    };
    //the chart is returned to the MeasurementsPage to show on the html-page
    return this.chart;
  }


  //get-method, returns the chart
  getChart() {
    return this.chart;
  }
  //set-method, sets the chart. probably never used. maybe to update the data
  public setChart(chart) {
    this.chart = chart;
  }
}
