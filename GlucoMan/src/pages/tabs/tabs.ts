import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MeasurementsPage } from '../measurements/measurements';
import { MedicationPage } from '../medication/medication';
import { NutritionPage } from '../nutrition/nutrition';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MeasurementsPage;
  tab2Root: any = NutritionPage;
  tab3Root: any = HomePage;
  tab4Root: any = MedicationPage;
  tab5Root: any = SettingsPage;

  constructor() {

  }
}
