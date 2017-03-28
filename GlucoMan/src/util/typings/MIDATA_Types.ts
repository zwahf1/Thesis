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

 export interface FHIR_MedicationRes {
   resourceType:string;
   code:CodeableConcept;
   status:string;
   isBrand:boolean;
   isOverTheCounter:boolean;
   form:CodeableConcept;
   ingredient:Array<MedicationIngredient>;
   package:{
     container:CodeableConcept;
     content:Array<MedicationPackageContent>;
     batch:Array<MedicationBatch>;
   };
   image:Array<MedicationImage>;
 }

 export interface FHIR_ObservationRes_1Value {
   resourceType: string,
   status: string,
   effectiveDateTime: any,
   category: CodeableConcept,
   code: CodeableConcept,
   valueQuantity: Value
 }

 export interface FHIR_ObservationRes_2Value {
   resourceType: string,
   status: string,
   code: CodeableConcept,
   effectiveDateTime: any,
   category: CodeableConcept,
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

 export interface Value {
   value: number,
   unit: string,
   system: string
 }

 export interface Component {
   code: CodeableConcept,
   valueQuantity: CodeableConcept
 }

 export interface MedicationIngredient {
   itemCodeableConcept:CodeableConcept;
   isActive:boolean;
   amount:any;
 }

 export interface MedicationPackageContent {
   itemCodeableConcept:CodeableConcept;
   amount:any;
 }

 export interface MedicationBatch {
   lotNumber:string;
   expirationDate:Date;
 }

 export interface MedicationImage {
   url:string;
   title:string;
 }
