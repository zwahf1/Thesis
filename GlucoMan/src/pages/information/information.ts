import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InformationDetailsPage } from '../information-details/information-details';
/*
  Generated class for the Information page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Informationen
      </ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <button ion-item *ngFor="let item of informationList" (click)="openNavDetailsPage(item)" icon-left>
        <ion-icon [name]="item.icon" [ngStyle]="{'color': item.color}" item-left></ion-icon>
        {{ item.title }}
        </button>
      </ion-list>
    </ion-content>
    `
})
export class InformationPage {
  informationList = [];

  constructor(public navCtrl: NavController) {
    this.informationList = [
      {
        'title': 'Reisen',
        'icon': 'plane',
        'description': '<p>Damit Ihre Reisen komplikationslos ablaufen, tun Sie gut&nbsp;daran, diese umsichtig zu planen. Dies gilt <strong>insbesondere&nbsp;f&uuml;r Flugreisen</strong>.</p><p>Es ist offiziell <strong>erlaubt, Insulin an Bord</strong> eines Flugzeugs mitzunehmen.&nbsp;Dennoch m&uuml;ssen Diabetes-Betroffene <strong>ein Attest&nbsp;ihres behandelnden Arztes</strong>&nbsp;vorzeigen k&ouml;nnen,&nbsp;welches &uuml;ber die Diabeteserkrankung und die Notwendigkeit,&nbsp;gewisse Utensilien mit sich zu f&uuml;hren, Auskunft gibt.</p><p>Das &auml;rztliche Attest kann Ihnen als detaillierte Checkliste f&uuml;r&nbsp;Ihr Diabetes-Zubeh&ouml;r dienen. Nehmen Sie <strong>zus&auml;tzlich</strong> mit:</p><ul><li>Impfausweis</li><li>Blutzuckerkontrollheft</li><li>Ersatz-Blutzuckermessger&auml;t und Zubeh&ouml;r</li><li>Ersatzmaterial f&uuml;r die Insulin-Injektion</li><li>Traubenzucker</li><li>Reiseapotheke</li></ul><p>Es empfiehlt sich, <strong>das Material auf Handgep&auml;ck und Koffer</strong>&nbsp;aufzuteilen (ausser Insulin: nur ins Handgep&auml;ck). Nicht&nbsp;jedes Gep&auml;ckst&uuml;ck kommt an!</p><p>Beachten Sie beim Insulin die Lagerungsvorschriften: Insulin darf nicht gefrieren und nicht der Sonne ausgesetzt&nbsp;werden.</p><p>Weitere wichtige Informationen, insbesondere auch zur&nbsp;Therapieanpassung bei Reisen mit Zeitverschiebung, finden&nbsp;Sie in der <strong>Brosch&uuml;re &laquo;Diabetes &amp; Flugreisen&raquo;</strong> auf&nbsp;<a href="http://www.diabetesuisse.ch">www.diabetesuisse.ch</a></p>',
        'color': '#E63135'
      },
      {
        'title': 'Autofahren',
        'icon': 'car',
        'description': '',
        'color': '#0CA9EA'
      },
      {
        'title': 'Selbstmanagement',
        'icon': '',
        'description': '',
        'color': '#F46529'
      },
      {
        'title': 'Impressum',
        'icon': 'information',
        'description': '',
        'color': '#CE6296'
      },
    ]
  }

  openNavDetailsPage(item) {
    this.navCtrl.push(InformationDetailsPage, { item: item });
  }
}
