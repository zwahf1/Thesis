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
        'description': '<p>Damit Ihre Reisen komplikationslos ablaufen, tun Sie gut&nbsp;daran, diese umsichtig zu planen. Dies gilt <strong>insbesondere&nbsp;f&uuml;r Flugreisen</strong>.</p><p>Es ist offiziell <strong>erlaubt, Insulin an Bord</strong> eines Flugzeugs mitzunehmen.&nbsp;Dennoch m&uuml;ssen Diabetes-Betroffene <strong>ein Attest&nbsp;ihres behandelnden Arztes</strong>&nbsp;vorzeigen k&ouml;nnen,&nbsp;welches &uuml;ber die Diabeteserkrankung und die Notwendigkeit,&nbsp;gewisse Utensilien mit sich zu f&uuml;hren, Auskunft gibt.</p><p>Das &auml;rztliche Attest kann Ihnen als detaillierte Checkliste f&uuml;r&nbsp;Ihr Diabetes-Zubeh&ouml;r dienen. Nehmen Sie <strong>zus&auml;tzlich</strong> mit:</p><ul><li>Impfausweis</li><li>Blutzuckerkontrollheft</li><li>Ersatz-Blutzuckermessger&auml;t und Zubeh&ouml;r</li><li>Ersatzmaterial f&uuml;r die Insulin-Injektion</li><li>Traubenzucker</li><li>Reiseapotheke</li></ul><p>Es empfiehlt sich, <strong>das Material auf Handgep&auml;ck und Koffer</strong>&nbsp;aufzuteilen (ausser Insulin: nur ins Handgep&auml;ck). Nicht&nbsp;jedes Gep&auml;ckst&uuml;ck kommt an!</p><p>Beachten Sie beim Insulin die Lagerungsvorschriften: Insulin darf nicht gefrieren und nicht der Sonne ausgesetzt&nbsp;werden.</p><p>Weitere wichtige Informationen, insbesondere auch zur&nbsp;Therapieanpassung bei Reisen mit Zeitverschiebung, finden&nbsp;Sie in der <strong>Brosch&uuml;re &laquo;Diabetes &amp; Flugreisen&raquo;</strong> auf&nbsp;<a href="http://www.diabetesschweiz.ch">www.diabetesschweiz.ch</a></p>',
        'color': 'color($colors, primaryLight)'
      },
      {
        'title': 'Autofahren',
        'icon': 'car',
        'description': '<p style="text-decoration: underline;">Allgemein:</p><ul><li>F&uuml;hren Sie<strong> immer rasch verwertbare Kohlenhydrate</strong> (z.B. normale Cola oder Fruchtsaft) und bei Fahrzeiten &uuml;ber einer Stunde Verpflegung f&uuml;r Unterwegs (z.B. Getreidestengel, Obst, Darvida) im Auto mit sich.</li><li>Nehmen Sie Ihr <strong>Blutzuckermessger&auml;t</strong> mit.</li><li>Halten Sie die Essenszeiten ein und verzichten Sie auf das Fahren unter Alkoholeinfluss.</li></ul><p>Sind Sie nicht nur mit <strong>Basalinsulin alleine, Gliclazid (Diamicron) oder mit Gliniden</strong> behandelt, beachten Sie folgendes:</p><p style="text-decoration: underline;">Vor der Fahrt:</p><ul><li>Messen Sie Ihren Blutzucker <strong>vor jeder Fahrt:</strong></li><li style="list-style-type: circle;">Liegt Ihr Blutzucker <strong>unter 5 mmol/l: <span style="color: #ff0000;">Nicht fahren!</span></strong> Nehmen Sie 20 g Kohlenhydrate (z.B. 2 dl Cola oder Fruchtsaft) zu sich und messen Sie erneut nach 20 Minuten.</li><li style="list-style-type: circle;">Liegt Ihr Blutzucker zwischen 5 und 7 mmol/l: Nehmen Sie 10 g Kohlenhydrate zu sich.</li></ul><p style="text-decoration: underline;">W&auml;hrend der Fahrt</p><ul><li>Bei <strong>ersten Anzeichen einer Unterzuckerung:</strong></li><li style="list-style-type: circle;"><span style="color: #ff0000;"><strong>Sofort anhalten!</strong></span> <strong>Warnblinkanlage einschalten.</strong> Nehmen Sie 20 g Kohlenhydrate ein. Erst weiterfahren, wenn der Blutzucker &uuml;ber 5 mmol/l liegt.</li><li>Machen Sie bei l&auml;ngeren Fahrten alle 1 bis 1.5 Stunden eine Pause zur Blutzuckerkontrolle und nehmen Sie bei Werten zwischen 5 und 6 mmol/l 10 g Kohlenhydrate ein.</li></ul><p>Mehr Informationen finden Sie hier:&nbsp;<a href="http://www.diabetesschweiz.ch">www.diabetesschweiz.ch</a></p>',
        //'color': '#0CA9EA'
      },
      {
        'title': 'Selbstmanagement',
        'icon': 'person',
        'description': '<p><strong>Regelm&auml;ssige Bewegung</strong> und ein <strong>gesundes K&ouml;rpergewicht&nbsp;</strong>sind wichtig f&uuml;r eine gute Stoffwechselkontrolle:<br /><strong>Rund 150 Minuten Bewegung pro Woche</strong>&nbsp;(30 Minuten an 5 Tagen pro Woche) sind empfohlen. Es muss sich dabei&nbsp;nicht um ein Sportprogramm handeln - im Alltag integrierte&nbsp;Aktivit&auml;t (auf dem Weg zur Arbeit, im Haushalt, in der&nbsp;Freizeit) gen&uuml;gt.</p><p><strong>Vermeiden</strong> Sie &Uuml;bergewicht. <strong>Bei &Uuml;bergewicht</strong> k&ouml;nnen&nbsp;bereits 3-5 kg Gewichtsverlust Ihre Blutzucker-, Blutdruck- und&nbsp;Blutfettwerte verbessern. Streben Sie eine <strong>langsame,&nbsp;</strong><strong>nachhaltige Gewichtsabnahme</strong> an.</p><p><span style="color: #ff0000;"><strong>1. Realistische Ziele setzen und festhalten</strong></span></p><p>Wichtig ist, dass Sie sich regelm&auml;ssig Ziele setzen, die Sie&nbsp;auch erreichen k&ouml;nnen. <strong>Halten Sie diese schriftlich fest.</strong></p><p><span style="color: #ff0000;"><strong>2. Konkrete Massnahmen planen</strong></span></p><p>Suchen Sie ganz bewusst nach M&ouml;glichkeiten, Ihre Ziele zu&nbsp;erreichen. <strong>Planen Sie</strong>, welche <strong>Massnahmen Sie konkret&nbsp;</strong><strong>umsetzen</strong> wollen (z.B. einmal pro Woche mit dem Velo zur&nbsp;Arbeit fahren, nach dem Nachtessen nicht naschen, usw.).</p><p><span style="color: #ff0000;"><strong>3. Erfolg kontrollieren und sich belohnen</strong></span></p><p><strong>Kontrollieren</strong> Sie regelm&auml;ssig Ihren <strong>Fortschritt</strong> und steigern&nbsp;Sie Ihre Ziele, wenn Sie diese erreicht haben. Vergessen Sie&nbsp;nicht, sich f&uuml;r das Erreichen Ihrer Ziele auch zu <strong>belohnen</strong>!&nbsp;Sollten Sie Ihr Ziel nicht erreichen, so <strong>lassen Sie sich nicht&nbsp;</strong><strong>entmutigen</strong>! Besprechen Sie mit einer Fachperson oder&nbsp;Gleichbetroffenen, <strong>was Sie daran gehindert</strong> hat - vielleicht&nbsp;finden Sie gemeinsam kreative L&ouml;sungsideen.</p>',
        //'color': '#F46529'
      },
      {
        'title': 'Impressum',
        'icon': 'information',
        'description': '',
        //'color': '#CE6296'
      },
    ]
  }

  openNavDetailsPage(item) {
    this.navCtrl.push(InformationDetailsPage, { item: item });
  }
}
