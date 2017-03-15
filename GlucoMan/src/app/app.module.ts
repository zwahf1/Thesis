import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MeasurementsPage } from '../pages/measurements/measurements';
import { MedicationPage } from '../pages/medication/medication';
import { NutritionPage } from '../pages/nutrition/nutrition';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactsPage } from '../pages/contacts/contacts';
import { MedicationDetailPage } from '../pages/medicationDetail/medicationDetail';

import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import { Storage } from '@ionic/storage';

import { HttpModule, JsonpModule } from '@angular/http';

declare var require: any;
var Highcharts = require('highcharts/highstock');

require('highcharts/highcharts-more.js')(Highcharts);

Highcharts.setOptions({
  lang: {
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    shortWeekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    resetZoom: 'alle anzeigen'
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
    TabsPage,
    ContactsPage,
    MedicationDetailPage
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
    TabsPage,
    ContactsPage,
    MedicationDetailPage
  ],
  providers: [
    Storage,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule { }
