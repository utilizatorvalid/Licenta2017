import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Platform } from 'ionic-angular'
import { Observable, Subject } from 'rxjs/Rx'
import { ISubscription } from "rxjs/Subscription";

import { DBMeter } from '@ionic-native/db-meter'
import { DbFrame } from '../models/db-frame'
import DecibelMeter from 'decibel-meter'
import { SensorVars } from './sensor-variabls'
/*
  Generated class for the SensorCollector provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SensorCollector {
  lastPosition: Geoposition;

  positionSubscription: ISubscription;
  dbMeterSubscription: ISubscription;

  isApp: boolean;

  watch: Observable<Geoposition>;
  locationChanges: number = 1;

  debug: string="";
  dist: number = 0;
  dbValue: number;
  dbAverage: number = 0;
  dbValues: number = 0;
  dbIterations: number = 0;

  webDbMeter: any;
  webMicrophoneSource: any;
  _geoposition = new Subject<Geoposition>();
  constructor(private geolocation: Geolocation,
    public platform: Platform,
    private dbMeter: DBMeter) {
    console.log('Hello SensorCollector Provider');
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      //i'm on browser
      this.isApp = false;
      this.prepareWebDbMeter();
    } else {
      this.isApp = true;
    }
    this.initiateGeolocation();
  }
  prepareWebDbMeter() {
    //set up new DecibelMeter
    this.webDbMeter = new DecibelMeter('');
    //getting microphoneSource
    this.webDbMeter.sources.then(sources => {
      console.log("Store default sources[0]", sources);
      this.webMicrophoneSource = sources[0];
    })

    this.webDbMeter.on('connect', (source, previous) => {
      // console.log(`Connected to ${source.label}`);
    })

    // callback for decibel-meter on value changed on microphone :)))
    this.webDbMeter.on('sample', (dB, percent, value) => {
      // console.log(dB, percent, value);
      if (percent != 0 && value != 0) {
        this.dbValues += percent;
        this.dbIterations += 1;
        this.dbValue = percent;
        this.dbAverage = this.dbValues / this.dbIterations;
      }
    });
  }
  recordDecibel(timeout: number): Promise<DbFrame> {
    return new Promise((resolve, reject) => {
      this.initiateDbMeter();
      setTimeout(() => {

        var noise_info = this.dbValueToNoiseLevel(this.dbAverage);
        resolve(new DbFrame(
          this.dbAverage,
          this.dbIterations,
          this.dbValues,
          this.dbValue,
          noise_info))
        this.terminateDbMeter();
      }, timeout)
    })
  }
  resetFrame() {
    this.dbAverage = 0;
    this.dbIterations = 0;
    this.dbValues = 0;
    this.dbValue = 0;
  }

  initiateDbMeter() {
    this.resetFrame();
    if (this.isApp) {
      this.dbMeterSubscription = this.dbMeter.start().subscribe((data) => {

        this.dbValue = data;
        this.dbIterations += 1;
        this.dbValues += data;
        this.dbAverage = this.dbValues / this.dbIterations;
      });
    } else {
      this.webDbMeter.connect(this.webMicrophoneSource);
      this.webDbMeter.listen();
    }
  }
  terminateDbMeter() {
    if (this.dbMeterSubscription) {
      this.dbMeterSubscription.unsubscribe();
      this.dbMeter.delete().then(() => {
        console.log("Deleted dbMeter instance\n");
      }).catch(err => {
        console.log("Error occured while deleting instance of dbMeter");
      })
    }
    if (this.dbMeter) {
      this.webDbMeter.stopListening();
      this.webDbMeter.disconnect()
    }
  }
  initiateGeolocation() {
    if (this.isApp) {
      
      this.debug += "get LOCATION from Mobile\n";
      this.debug+= JSON.stringify(this.geolocation.getCurrentPosition.toString());
      this.geolocation.getCurrentPosition().then((position) => {
        this.lastPosition = position;
         this._geoposition.next(position);
      }).catch((error) => {
        this.debug+=`Error getting location ${error}\n`;
      });

      if (this.watch)
        return;

      this.watch = this.geolocation.watchPosition();
      this.positionSubscription = this.watch.filter((p) => p.coords !== undefined).subscribe((position) => {
        if (position.coords.latitude !== this.lastPosition.coords.latitude ||
          position.coords.longitude !== this.lastPosition.coords.longitude ||
          position.coords.accuracy < this.lastPosition.coords.accuracy) {
          this.debug += JSON.stringify({ long: position.coords.longitude, lat: position.coords.latitude }) + '\n';
          this.lastPosition = position;
          this.locationChanges += 1;
          console.log(position, this.locationChanges);
          this._geoposition.next(position);
        }
      }, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.debug = "User denied the request for Geolocation"
            break
          case error.POSITION_UNAVAILABLE:
            this.debug = "Location information is unavailable."
            break
          case error.TIMEOUT:
            this.debug = "The request to get user location timed out."
            break;
        }
      })
    }
    else {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported in your browser")
        return;
      }
      navigator.geolocation.watchPosition((position) => {
        if (!this.lastPosition) {
          this.lastPosition = position;
          this._geoposition.next(position);
        }
        if (this.lastPosition.coords.latitude != position.coords.latitude ||
          this.lastPosition.coords.longitude != position.coords.longitude) {
          this.locationChanges += 1;
          this.lastPosition = position;
          this._geoposition.next(position);
          console.log(position, this.locationChanges);

        }
      }, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        }
      })
    }
  }
  terminateGeolocation() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
      this.watch = null;
    }
    this.lastPosition = null;
  }


  public getLocation(): Observable<Geoposition> {
    if (this.lastPosition) {
      setTimeout(() => {
        this._geoposition.next(this.lastPosition)
      },
        2000)
    }
    return this._geoposition.asObservable();
  }

  dbValueToNoiseLevel(dbValue: number): Object {
    let closestValue = 10,
      minDiff = Math.abs(dbValue - 10)
    SensorVars.array_decibels.forEach(element => {
      if (Math.abs(dbValue - element) <= minDiff) {
        closestValue = element;
        minDiff = Math.abs(dbValue - element)
      }
    });
    console.log(`noise level ${closestValue}:`, SensorVars.noiseLevels[closestValue])
    return SensorVars.noiseLevels[closestValue] || {};
  }

}
