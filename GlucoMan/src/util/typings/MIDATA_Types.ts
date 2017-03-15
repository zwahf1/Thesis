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

 export interface MIDATA_MedicationRes {
   resourceType:string;
   category:string;
   status:string;
   sent:Date;
   received:Date;
 }

 export interface LOCAL_MedicationRes {
   title: string;
   date: Date;
 }
