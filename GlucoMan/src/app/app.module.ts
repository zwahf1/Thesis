import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MeasurementsPage } from '../pages/measurements/measurements';
import { MedicationPage } from '../pages/medication/medication';
import { NutritionPage } from '../pages/nutrition/nutrition';
import { SettingsPage } from '../pages/settings/settings';
import { TargetrangePage } from '../pages/targetrange/targetrange';
import { DisplayPage } from  '../pages/display/display';
import { DataPage } from '../pages/data/data';
import { MeasureplanPage } from '../pages/measureplan/measureplan';
import { TabsPage } from '../pages/tabs/tabs';
import { InformationPage } from '../pages/information/information';
import { EmergencyPage } from '../pages/emergency/emergency';
import { CheckupsPage } from '../pages/checkups/checkups';
import { MedicationDetailPage } from '../pages/medicationDetail/medicationDetail';
import { DisclaimerPage } from '../pages/disclaimer/disclaimer';
import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { InformationDetailsPage } from '../pages/information-details/information-details';

import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { HttpModule, JsonpModule } from '@angular/http';

declare var require: any;

var Highcharts = require('highcharts/highstock');

require('highcharts/highcharts-more.js')(Highcharts);

//the language of the charts from the Highcharts modul are translated to german.
Highcharts.setOptions({
  lang: {
    months:   ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
              'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths:  ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul',
                  'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdays:     ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
                  'Donnerstag', 'Freitag', 'Samstag'],
    shortWeekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    resetZoom: 'alles anzeigen'
  },
});

export { Highcharts };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MeasurementsPage,
    MedicationPage,
    NutritionPage,
    SettingsPage,
    TargetrangePage,
    DisplayPage,
    DataPage,
    MeasureplanPage,
    InformationPage,
    InformationDetailsPage,
    EmergencyPage,
    CheckupsPage,
    TabsPage,
    MedicationDetailPage,
    DisclaimerPage,
    BluetoothPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    JsonpModule,
    ChartModule.forRoot(
      require('highcharts/highstock'),
      require('highcharts/highcharts-more')
    ),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MeasurementsPage,
    MedicationPage,
    NutritionPage,
    SettingsPage,
    TargetrangePage,
    DisplayPage,
    DataPage,
    MeasureplanPage,
    InformationPage,
    InformationDetailsPage,
    EmergencyPage,
    CheckupsPage,
    TabsPage,
    MedicationDetailPage,
    DisclaimerPage,
    BluetoothPage
  ],
  providers: [
    Storage,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BluetoothSerial
  ]
})

export class AppModule { }
