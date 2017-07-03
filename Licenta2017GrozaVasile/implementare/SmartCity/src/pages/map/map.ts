import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker,
  AnimateCameraOptions
} from '@ionic-native/google-maps';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  private geometry: any;
  private place: any;
  private event: any;
  private markerTitle: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private googleMaps: GoogleMaps) {
    // this.geometry = this.navParams.get('geometry');
    this.place = this.navParams.get('place');
    this.event = this.navParams.get('event');
    if (this.place) {
      this.geometry = this.place.geometry
      this.markerTitle = this.place.name
    }
    if(this.event){
      this.geometry = {
        location: {
          lat:'',
          lng:''
        }
      };
      console.log("__________________________",this.event);
      this.geometry.location.lat = this.event.venue.location.latitude
      this.geometry.location.lng = this.event.venue.location.longitude
      this.markerTitle = this.event.name;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }
  ngAfterViewInit() {
    this.loadMap();
  }
  loadMap() {
    // make sure to create following structure in your view.html file
    // and add a height (for example 100%) to it, else the map won't be visible
    // <ion-content>
    //  <div #map id="map" style="height:100%;"></div>
    // </ion-content>

    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map: GoogleMap = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      });

    // create LatLng object
    let ionic: LatLng = new LatLng(this.geometry.location.lat, this.geometry.location.lng);

    // create CameraPosition
    let position: AnimateCameraOptions = {
      target: ionic,
      zoom: 16,
      tilt: 30
    };

    // move the map's camera to position
    map.animateCamera(position).then(() => {
      let markerOptions: MarkerOptions = {
        position: ionic,
        title: this.markerTitle,
        animation: 'DROP'
      };
      map.addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
        });

    })

    // create new marker

  };


}
