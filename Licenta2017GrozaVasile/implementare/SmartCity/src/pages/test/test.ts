import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Geolocation, Coordinates, Geoposition } from '@ionic-native/geolocation';

import { Platform } from 'ionic-angular'
import { Observable } from 'rxjs/Observable'
import { ISubscription } from "rxjs/Subscription";

import { SensorCollector } from '../../providers/sensor-collector'
import { DbFrame } from '../../models/db-frame'

import { ServerEmmiter } from "../../services/server-emmiter/server-emmiter.service"

/**
 * Generated class for the Location page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage implements OnInit, OnDestroy {

  positionSubscription: ISubscription;
  positionSubscription1: ISubscription;

  coord: Coordinates;
  mgrs_currentLocation: String = null;
  mgrs_lastLocation: String = null;
  debug: string = 'empty\n';
  isApp: boolean;
  watch: Observable<Geoposition>;
  locationChanges: number = 1;
  dist: number = 0;
  dbRecord: DbFrame;
  sendNoise: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    public platform: Platform,
    private sensorCollector: SensorCollector,
    public serverEmmiter: ServerEmmiter) {


    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isApp = false;
    }
    else {
      this.isApp = true;


    }

  }
  ngOnInit() {
    console.log("init Location Page")
  }
  ngOnDestroy() {
    console.log("destroy Location")
    if (this.positionSubscription || this.positionSubscription1)
      if (this.positionSubscription)
        this.positionSubscription.unsubscribe();

    if (this.positionSubscription1)
      this.positionSubscription1.unsubscribe();
  }

  // getDecibelMeasure(next) {
  //   this.sensorCollector.recordDecibel(10000).then((recordResult) => {
  //     this.dbRecord = recordResult;
  //     this.debug += "\n***\n after 10000=>" + JSON.stringify(recordResult);
  //   // this.serverEmmiter.emmitNoiseLevel({
  //             coords:{
  //                     accuracy:this.coord.accuracy,
  //                     altitude:this.coord.altitude,
  //                     altitudeAccuracy:this.coord.altitudeAccuracy,
  //                     heading:this.coord.heading,
  //                     latitude:this.coord.latitude,
  //                     longitude:this.coord.longitude,
  //                     speed:this.coord.speed
  //                   }, 
  //             recordResult:recordResult
  //           }
  //                                         // )
  //     .subscribe(
  //       data=>{
  //         console.log(data)
  //         next(null, data);
  //       },
  //       err=>{
  //         console.log(err);
  //         next(err);
  //       }
  //     )
  //   })
  // }
  watchLocation() {

    if (!this.positionSubscription) {
      this.debug += "Starting to watch location:\n"
       this.measureNoise(this.mgrs_currentLocation);
       
       setInterval(() => {
         console.log("FROM INTERVAL", new Date())
        },
          60000);
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
        // console.log(JSON.stringify(location))
       
        this.serverEmmiter.emmitLocation(location)
          .subscribe(
          data => {

            // if (this.mgrs_currentLocation != data.currentLocation) {
            //   //mi-am schimbat locatia si trebuie sa trimit nivelul de zgomot
            //   console.log(`${this.mgrs_currentLocation} != ${data.currentLocation}`,this.mgrs_currentLocation != data.currentLocation);
            //   //this.measureNoise(data.currentLocation)
            // }
            console.log(data);
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
    console.log("MEASURE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...",location)
    // if(!location)
      // return;
    this.sensorCollector.recordDecibel(10000).then((recordResult) => {
      console.log(`have to send \n`, recordResult);
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

  stopWatchingLocation() {
    if (this.positionSubscription) {
      console.log("StopWatchingLocation")
      this.positionSubscription.unsubscribe();
      this.positionSubscription = null;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Location');
  }
}
