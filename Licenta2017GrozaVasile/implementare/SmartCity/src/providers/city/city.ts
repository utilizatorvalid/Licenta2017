import { Injectable } from '@angular/core';
import { Http,  Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt'
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { GoogleVars } from  './google-variabls'
/*
  Generated class for the CityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CityProvider {
  //private serverUrl = 'http://localhost:8000'
  // private serverUrl = "http://172.17.254.37:8000" //pentru localhost in wi-fi
  private serverUrl = 'http://ec2-13-58-71-207.us-east-2.compute.amazonaws.com:8000'
  //private serverUrl = 'https://sc-server-testing-utilizatorvalid.c9users.io'
  // private serverUrl = 'http://smartcityserver.azurewebsites.net/'

  constructor(public http: Http,
    public authHttp: AuthHttp) {
    console.log('Hello CityProvider Provider');
  }

  loadCity(): Observable<any> {
    let endpoint = this.serverUrl + `/schedule`
    let headers = new Headers({ "Content-Type": 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.authHttp.get(endpoint, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  nearbyPlaces(coord, radius, type){
    let searchOptions = {
      "location":`47.1772069,27.572458`, 
      "radius": radius, 
      "types": type}

    let endpoint = GoogleVars.endpoint;

    for(var option in searchOptions)
      endpoint+=`&${option}=${searchOptions[option]}`;
    endpoint+=`&key=${GoogleVars.googlePlacesKey}`
    console.log(endpoint);
  }

}
