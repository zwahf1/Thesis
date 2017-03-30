import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import * as TYPES from '../../util/typings/MIDATA_Types';

@Component({
  selector: 'page-medicationDetail',
  templateUrl: 'medicationDetail.html'
})

export class MedicationDetailPage {
  medication : TYPES.FHIR_MedicationStatementRes;
/**************************************************
                  constructor

create the detail page for the given medication
***************************************************/
  constructor(public params: NavParams) {
    this.medication = params.get('medi');
  }
}
