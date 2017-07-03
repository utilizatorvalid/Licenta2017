import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service'


import { Platform } from 'ionic-angular'
import { Observable } from 'rxjs/Observable'
import { ISubscription } from "rxjs/Subscription";

import { Geolocation, Coordinates, Geoposition } from '@ionic-native/geolocation';
import { SensorCollector } from '../../providers/sensor-collector'

import { ServerEmmiter } from "../../services/server-emmiter/server-emmiter.service"


/**
 * Generated class for the Home page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {
  user: Object
  positionSubscription: ISubscription;
  coord: Coordinates;
  mgrs_currentLocation: String = null;
  mgrs_lastLocation: String = null;
  isApp: boolean;
  watch: Observable<Geoposition>;
  debug: String = '';
  city: any;
  placesDictionary: Array<{ title: string, placesObj: Object, icon: string, showDetails: boolean }> = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    private geolocation: Geolocation,
    public platform: Platform,
    public sensorCollector: SensorCollector,
    public auth: AuthService,
    public serverEmmiter: ServerEmmiter) {
    this.menu = menu;
    this.menu.enable(true, "myMenu")

    this.user = this.navParams.get("user");


    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.auth.isApp = false;
    }
    else {
      this.auth.isApp = true;
    }
    this.watchLocation();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home');
  }

  /**
   * 
   * @param onChangeMgrs 
   */
  watchLocation() {

    if (!this.positionSubscription) {
      this.debug += "Starting to watch location:\n"
      if (!this.auth.isApp) {
        this.measureNoise(this.mgrs_currentLocation);
      } else {
        this.debug += "set interval for measureNoise\n"
        setInterval(() => {
          this.measureNoise(this.mgrs_currentLocation);
        }, 60000);
      }
      this.positionSubscription = this.sensorCollector.getLocation().subscribe(position => {
        this.coord = position.coords;
        let location = {
          position: {
            coords: {
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed
            },
            timestamp: position.timestamp
          }
        }
        console.log(JSON.stringify(location))

        this.serverEmmiter.emmitLocation(location)
          .subscribe(
          data => {

            if (this.mgrs_currentLocation != data.currentLocation) {
              //mi-am schimbat locatia si trebuie sa trimit nivelul de zgomot
              console.log(`${this.mgrs_currentLocation} != ${data.currentLocation}`, this.mgrs_currentLocation != data.currentLocation);
              this.auth.user["mgrs_currentLocation"] = data.currentLocation;
              this.auth.user["mgrs_lastLocation"] = data.lastLocation;
              this.loadCityData();
              this.loadPlaces();
              //this.measureNoise(data.currentLocation)
            }
            console.log(data);
            this.auth.user["mgrs_currentLocation"] = data.currentLocation;
            this.auth.user["mgrs_lastLocation"] = data.lastLocation;
            this.mgrs_currentLocation = data.currentLocation;
            this.mgrs_lastLocation = data.lastLocation;

          },
          err => {
            console.log(err);
          });

      })
    }

  }

  measureNoise(location) {
    this.debug += `MEASURE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...\n${location}`
    if (!location) {
      return;
    }
    this.sensorCollector.recordDecibel(10000).then((recordResult) => {
      this.debug += `have to send \n` + JSON.stringify(recordResult);
      let decibelMeasure = {
        "mgrs": location,
        "recordResult": recordResult
      }
      this.serverEmmiter.emmitNoiseLevel(decibelMeasure).subscribe(

        (data) => {

        },
        (err => {

        })
      );
    }).catch((err) => {
      console.log("error on recording")
    });
  }

  loadCityData() {
    console.log("LoadCityData for location:")
    console.log(this.auth.user.mgrs_currentLocation);

    this.serverEmmiter.getCityGeneralData(this.auth.user.mgrs_currentLocation)
      .subscribe(
      data => {
        console.log(data);
        this.city = data.result.result;
      },
      error => {

      }
      )
  }
  getTitleForPlaceType(placeType) {
    return placeType.replace('_', ' ').toLocaleUpperCase();
  }
  loadPlaces() {
    console.log('loading nearby Places for location:');
    console.log(this.auth.user.mgrs_currentLocation);


    this.serverEmmiter.getCityPlaces(this.auth.user.mgrs_currentLocation)
      .subscribe(
      data => {
        console.log("places loaded", data);
        this.placesDictionary = [];
        for (var placeType in data.places) {
          console.log(placeType, '=>', data.places[placeType]);
          this.placesDictionary.push(
            {
              title: this.getTitleForPlaceType(placeType),
              placesObj: data.places[placeType],
              icon: 'add-circle',
              showDetails: false
            })
        }
        console.log(this.placesDictionary);


      },
      error => {

      }
      )
  }
  toggleDetails(data) {
    console.log('toogle')
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'add-circle';
    } else {
      data.showDetails = true;
      data.icon = 'remove-circle';
    }
  }


}
