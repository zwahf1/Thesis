import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/*
  Generated class for the Data page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Datenschutzerklärung',
      message: '<div><h3>Haftungsausschluss</h3>Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</div> <br/> <div><h3>Urheberrechte</h3> Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website gehören ausschliesslich muk mikmiu oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.</div> <br/> <div><h3>Datenschutz</h3> Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten. Wir halten diese  Bestimmungen ein. Persönliche Daten werden streng vertraulich behandelt und weder an Dritte verkauft noch weiter gegeben. In enger Zusammenarbeit mit unseren Hosting-Providern bemühen wir uns, die Datenbanken so gut wie möglich vor fremden Zugriffen, Verlusten, Missbrauch oder vor Fälschung zu schützen. Beim Zugriff auf unsere Webseiten werden folgende Daten in Logfiles gespeichert: IP-Adresse, Datum, Uhrzeit, Browser-Anfrage und allg. übertragene Informationen zum Betriebssystem resp. Browser. Diese Nutzungsdaten bilden die Basis für statistische, anonyme Auswertungen, so dass Trends erkennbar sind, anhand derer wir unsere Angebote entsprechend verbessern können.</div>',
      buttons: ['Schliessen']
    });
    alert.present()
  }
}
