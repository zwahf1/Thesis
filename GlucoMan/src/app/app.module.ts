import { NgModule, ErrorHandler } from '@angular/core';
//import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MeasurementsPage } from '../pages/measurements/measurements';
import { MedicationPage } from '../pages/medication/medication';
import { NutritionPage } from '../pages/nutrition/nutrition';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';

import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import { Storage } from '@ionic/storage';

declare var require: any;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MeasurementsPage,
    MedicationPage,
    NutritionPage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    ChartModule.forRoot(require('highcharts'))
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
    TabsPage
  ],
  providers: [
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
