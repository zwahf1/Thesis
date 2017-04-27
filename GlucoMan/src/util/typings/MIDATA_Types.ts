//MIDATA_Types from mko1:
// - MIDATA_request
// - DateToValue
// - MIDATA_properties
// - MIDATA_authResponse
// - MIDATA_Triplet
export interface MIDATA_request
 {
     authToken: string;
     fields: string[];
     properties: MIDATA_properties;

 }

export interface DateToValue
{
    [date: string]: number;
}



 export interface MIDATA_properties
 {
     owner: string;
     format?: string;
     content?: string;
     data?: any;
     index?: any;
 }

 export interface MIDATA_authResponse
 {
     authToken: string;
     refreshToken: string;
     status: string;
     owner: string;
 }

 export interface MIDATA_Triplet
 {
     date: string;
     value: number;
     unit: string;
 }

 export interface LOCAL_MedicationStatementRes {
   resourceType:string;
   status:string;
   medicationCodeableConcept:CodeableConcept;
   effectiveDateTime:any;
   subject?:any;
   note:Array<any>;
   dosage:Array<any>;
   article: Article;
 }

 export interface LOCAL_Glucose {
   date: Date;
   value: number;
   event: string;
 }

 export interface Article {
   gtin: string,
   pharmaCode: string,
   prodNo: string,
   description: string,
   title?: string
   img: string,
   imgFrontPack?: string,
   imgBackPack?: string,
   imgFrontDrug?: string,
   imgBackDrug?: string,
 }

 export interface FHIR_MedicationStatementRes {
   resourceType:string;
   identifier?:Array<any>;
   basedOn?:Array<any>;
   partOf?:Array<any>;
   context?:any;
   status:string;
   category?:CodeableConcept;
   medicationCodeableConcept:CodeableConcept;
   medicationReference?:any;
   effectiveDateTime:any;
   effectivePeriod?:any;
   dateAsserted?:any;
   informationSource?:any;
   subject?:any;
   derivedFrom?:Array<any>;
   taken:string;
   reasonNotTaken?:Array<CodeableConcept>;
   reasonCode?:Array<CodeableConcept>;
   reasonReference?:Array<any>;
   note?:Array<any>;
   dosage?:Array<Dosage>;
 }

 export interface FHIR_ObservationRes_1Value {
   resourceType: string;
   status: string;
   effectiveDateTime: any;
   category: CodeableConcept;
   code: CodeableConcept;
   valueQuantity: Value;
 }

 export interface FHIR_ObservationRes_2Value {
   resourceType: string;
   status: string;
   effectiveDateTime: any;
   category: CodeableConcept;
   code: CodeableConcept;
   component: Array<Component>
 }

 export interface CodeableConcept {
   coding:Array<Coding>;
   text?:string;
 }

 export interface Coding {
   system:string;
   code:string;
   display:string;
 }

 export interface Dosage {
   timing: {
     repeat: {
       frequency:number;
       period:number;
       periodUnit:string;
     }
   },
   route: CodeableConcept;
 }

 export interface Value {
   value: number,
   unit: string,
   system: string
 }

 export interface Component {
   code: CodeableConcept,
   valueQuantity: Value
 }
