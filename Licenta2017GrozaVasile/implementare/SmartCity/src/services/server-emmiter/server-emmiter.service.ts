import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { AuthHttp, JwtHelper } from 'angular2-jwt'

import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ServerEmmiter {
    // private serverUrl = 'http://localhost:8000'
    // private serverUrl = "http://172.17.50.147:8000" //pentru localhost in wi-fi
    private serverUrl = 'http://ec2-13-58-71-207.us-east-2.compute.amazonaws.com:8000'
    // private serverUrl = 'https://sc-server-testing-utilizatorvalid.c9users.io'
    // private serverUrl = 'http://smartcityserver.azurewebsites.net/'
    public noPhotoUrl :String = `${this.serverUrl}/no_image.png`
    constructor(private http: Http, private authHttp: AuthHttp) {
    }

    emmitLocation(body: Object): Observable<any> {
        let endpoint = this.serverUrl + '/location'
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.authHttp.post(endpoint, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }
    emmitNoiseLevel(body: Object): Observable<any> {
        let endpoint = this.serverUrl + '/noise'
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.authHttp.post(endpoint, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }
    addEvent(event: any): Observable<any> {
        let endpoint = this.serverUrl + `/schedule/${event._id}`
        let bodyString = JSON.stringify(event);
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.authHttp.post(endpoint, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }
    removeEvent(event: any): Observable<any> {
        let endpoint = this.serverUrl + `/schedule/${event._id}`
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.authHttp.delete(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }

    getUserEvents(): Observable<any> {
        let endpoint = this.serverUrl + `/schedule`
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }
    /**
     * 
     * @param params  params to search events for, example { mgrs: "35TNN437242", startTime: "2017-06-03T18:00:00+0300", endTime:"2017-06-20T18:00:00+0300"  }
     */
    loadAllEvents(params): Observable<Array<Object>> {

        let endpoint = this.serverUrl + `/events/?mgrs=${params.mgrs}&startTime=${params.startTime}&endTime=${params.endTime}&radius=${params.radius}`;
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.authHttp.get(endpoint, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    }

    getCoordinateInfo(mgrs): Observable<any> {
        let endpoint = this.serverUrl + `/location/${mgrs}`
        let headers = new Headers({ "content-type": 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getWeather(units, days, coord): Observable<any> {
        console.log(days, coord);
        //metric for celsius
        //imperial for faranhait
        //kelvin by default
        let metric
        switch (units) {
            case 'C':
                metric = '&units=metric';
                break;
            case 'F':
                metric = 'imperial'
                break
            case 'K':
                metric = ''
                break;
            default:
                metric = '&units=metric';
                break;
        }

        let endpoint = this.serverUrl + `/weather?lat=${coord.latitude}&lon=${coord.longitude}&cnt=${days}${metric}`
        let headers = new Headers({ "content-type": 'application/json' });

        // let searchParams = new URLSearchParams()
        // searchParams.set('lat', coord.latitude);
        // searchParams.set('lon', coord.longitude);
        // searchParams.set('cnt', days);
        let options = new RequestOptions({
            headers: headers,
        });
        console.log(options);
        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getUserData(user_id): Observable<any> {
        let endpoint = this.serverUrl + `/user/${encodeURIComponent(user_id)}`;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }

    getCityGeneralData(mgrs_value): Observable<any> {
        let endpoint = this.serverUrl + `/city/${mgrs_value}`;
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }

    getCityPlaces(mgrs_value): Observable<any> {
        let endpoint = this.serverUrl + `/city/${mgrs_value}/places`;
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }

    getPlaceInfo(place_id): Observable<any> {
        let endpoint = this.serverUrl + `/place/${place_id}`;
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.authHttp.get(endpoint, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }

    addOwnEvent(event):Observable<any>{
        let endpoint = this.serverUrl + `/schedule_place`
        let bodyString = JSON.stringify(event);
        let headers = new Headers({ "Content-Type": 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.authHttp.post(endpoint, bodyString, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }



}
