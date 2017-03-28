import { Midata } from 'midata';
import * as MidataTypes from './typings/MIDATA_Types';

import { Injectable } from '@angular/core';

/*----------------------------------------------------------------------------*/
/* MidataPersitence (^.^) (not realy persistence... but almost)
/* zwahf1
/* This class is meant to be the "LINK" between your code and the midata.js library
/* It should handle all "search queries" and map the result from
   the received JSON into a TypeScript object. It also should convert new
   values from TypeScript objects to the correct JSON object to store on MIDATA.
/*----------------------------------------------------------------------------*/
@Injectable()
export class MidataPersistence {
  private static mp:MidataPersistence;
  private md: any;

  private appname = 'GlucoMan';
  private appsecr = 'AkSyC8Ab2D2JgA5CjohH8q4JFDqOaSAw';
  private server = 'https://test.midata.coop:9000';
  private role: string;
  private username: string;
  private password: string;

  private authResponse: MidataTypes.MIDATA_authResponse;

  private constructor(){
    this.md = new Midata(this.server, this.appname, this.appsecr);
  }

  // Getter for getting the instance
  // EXAMPLE:           var mp = MidataPersistence.midataPersistence();
  static getInstance():MidataPersistence {
    if (this.mp == null) {
      this.mp = new MidataPersistence();
    }
    return this.mp;
  }

  // Set the role of the user to login.
  setRole(r: string) {
    this.role = r;
  }

  getRole() : string {
    return this.role;
  }

  // Login function (call it with MidataPersistence.login(un, pw, role))
  // Returns the authResponse
  // -->  un:   Unsername
  // -->  pw:   Passwort
  // -->  role: User-role
  //            The user Role can be 'member', 'provider', 'developer' or 'research'
  login(un: string, pw: string){
    this.username = un;
    this.password = pw;
    // Casting role from string to UserRole with "<UserRole> role"
    return this.md.login(un, pw , 'member').then(result => {
      console.log("login successful");

      this.authResponse =
      {
        authToken: result.authToken,
        refreshToken: result.refreshToken,
        status: result.status,
        owner: result.owner
      };

      console.log("the result:");
      console.log(result);
      console.log("Bearer " + result.authToken);
      console.log("mapped:");

      return this.authResponse;
    })
  }

  // Check if logged in (call it with MidataPersistence.loggedIn())
  // returns true if logged in and false if not
  loggedIn() {
    return this.md.loggedIn;
  }

  // Logout function (call it with MidataPersistence.logout())
  logout() {
    this.md.logout();
    console.log("logged out");
  }

  getLoggedInId(){
    console.log('logged in id... ' + this.authResponse);
    return this.authResponse.owner;
  }

  // Search function (call it with MidataPersistence.search(Resource, {}))
  // Searches for a resrouce with a defined type
  // If the params are defined, it will look up for the resource with the given params
  // --> resourceTyoe:  Can be any 'fhir' resource as a string. Example: "Patient", "Person" or "Observation"
  // --> params:        A JSON object with the given params. Can also be empty "{}"
  //                    Look up for the possible params at http://build.fhir.org/search.html and the specific resource doc
  // IMPORTANT:         This is an asynchronus call. You have to use the '.then(function (response) {})' notation.
  // EXAMPLE:           var mp = MidataPersistence.midataPersistence();
  //                    mp.search("Person", {}).then(function(personList) {
  //                      console.log(personList);
  //                    });
  search(resourceType: string, params?: any) {
    return this.md.search(resourceType, params);
  }

  save(res: any) {
    return this.md.save(res);
}

}
