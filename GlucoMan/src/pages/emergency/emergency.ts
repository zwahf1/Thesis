import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

declare var cordova: any;

/*
 Generated class for the Emergency page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
*/
@Component({
 selector: 'page-emergency',
 templateUrl: 'emergency.html'
})
export class EmergencyPage {

constructor(public navCtrl: NavController, public navParams: NavParams) {}

changeLanguage(langShow: string, langHide: string){
 document.getElementById(langShow).style.display = 'block';
 document.getElementById(langHide).style.display = 'none';
}

copyText(lang){

 if(lang == 'german'){
 cordova.plugins.clipboard.copy('Falls ich mich ungewöhnlich verhalte und den Eindruck erwecke, als wäre ich betrunken, kann das ein Zeichen einer Unterzuckerung sein.\n\n'+
 'Bitte geben Sie mir 20g Zucker, z.B. als 2dl gesüsstes Getränk oder mind. 4 Stück Traubenzucker oder Würfelzucker. Verbessert sich mein Zustand nicht innert 10 Minuten, rufen Sie einen Arzt oder den Notfalldienst.\n\n'+
 'Falls ich bewusstlos bin, geben Sie mir nichts und rufen Sie sofort einen Arzt oder den Notfalldienst.');
console.log('did copy german');
 }else{
  cordova.plugins.clipboard.copy('In case you find me disorientedorconfused this may be a sign of low blood sugar.\n\n'+
'Please give me some form of sugar(20 g), e.g. 200 ml sugary drink (not a diet drink) or dextrose tablet. If my situation does not improve within 10 minutes call a doctor or an ambulance.\n\n'+
'If I am unconscious do notgive me anything by mouth. Call a doctor or an ambulance immediately.');
console.log('did copy english');
 }

}
}
