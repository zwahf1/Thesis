import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MeasurementsPage } from '../measurements/measurements';
import { MedicationPage } from '../medication/medication';
import { NutritionPage } from '../nutrition/nutrition';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MeasurementsPage;
  tab3Root: any = NutritionPage;
  tab4Root: any = MedicationPage;

  constructor() {

  }
}
