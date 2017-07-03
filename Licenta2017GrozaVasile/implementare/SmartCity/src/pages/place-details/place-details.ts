import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServerEmmiter } from '../../services/server-emmiter/server-emmiter.service'

import { AlertController } from 'ionic-angular';

import { MapPage } from '../../pages/map/map'
import { PlaceFormModalPage } from '../../pages/place-form-modal/place-form-modal'


import { AuthService } from '../../services/auth/auth.service'
import { ModalController } from 'ionic-angular';
import { SensorCollector } from '../../providers/sensor-collector'
import { Storage } from '@ionic/storage'
/**
 * Generated class for the PlaceDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-place-details',
  templateUrl: 'place-details.html',
})
export class PlaceDetailsPage {

  public place: any;
  public placeDetails: any;
  locationInfo: any;
  data: Array<{ title: string, details: Array<any>, type: string, icon: string, showDetails: boolean }> = [];
  private storage: Storage = new Storage('localstorage');
  tempUnit: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private auth: AuthService,
    private modalCtrl: ModalController,
    private serverEmmiter: ServerEmmiter,
    private sensorCollector: SensorCollector,
    private alertCtrl: AlertController) {

    this.place = this.navParams.get('place');
    this.placeDetails = this.navParams.get('placeDetails');
    console.log('placeDetails', this.place, this.placeDetails)
    console.log(this.auth.user.mgrs_currentLocation);

    this.data.push({
      title:'Working Time',
      details:[],
      type:'work_time',
      icon:'remove-circle',
      showDetails:true
    })
    this.serverEmmiter.getCoordinateInfo(this.placeDetails.geometry.location.mgrs).subscribe(
      data => {
        this.locationInfo = data;
        this.processLocationDetails();
        console.log(this.locationInfo, "LOCATION INFO")
      },
      error => {

      });

    this.storage.get('tempUnit')
      .then((tempUnit) => {
        this.tempUnit = tempUnit;
        this.serverEmmiter.getWeather(tempUnit, 7,
          {
            longitude: this.placeDetails.geometry.location.lng,
            latitude: this.placeDetails.geometry.location.lat
          }).subscribe(
          data => {
            console.log("weather response");
            console.log(data);
            // data = JSON.parse(data);
            let weatherDetail = []
            for (var i = 0; i < data.list.length; i++) {
              let day = data.list[i];
              weatherDetail.push(day);
            }
            this.data.push({
              title: "Weather",
              details: weatherDetail,
              type: "weather",
              icon: 'add-circle',
              showDetails: false
            })
          },
          error => {

          }
          )
      });

  }
  processLocationDetails() {
    if (!this.locationInfo)
      return;
    this.locationInfo["noiseInfo"] = this.sensorCollector.dbValueToNoiseLevel(this.locationInfo.noiseLevelMean)
    let noiseString;
    if(!this.locationInfo.noiseLevelMean)
      noiseString = "Seems like we don't have any information about noise level in this zone";
    else
      noiseString = `In this location noise level is: ${this.locationInfo.noiseLevelMean.toFixed(2)} dB`;  
    this.data.push({
      title: 'Decible measure',
      details: [noiseString],
      icon: 'add-circle',
      type: "text",
      showDetails: false
    })
    this.data.push({
      title: 'Noise Level',
      details: [`Level of the sound is: ${this.locationInfo.noiseInfo.sound}. For example ${this.locationInfo.noiseInfo.example}`],
      type: 'text',
      icon: 'add-circle',
      showDetails: false
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaceDetailsPage');
  }
  openMaps() {
    this.navCtrl.push(MapPage,
      {
        place: this.placeDetails
      });
  }
  goToPlace() {
    let modalForm = this.modalCtrl.create(PlaceFormModalPage, {
      'place': this.place,
      'placeDetails': this.placeDetails
    })
    modalForm.onDidDismiss(formResponse => {
      if(formResponse.type=='ok')
        this.addEventToPlace(formResponse);
    })
    modalForm.present();
  }

  addEventToPlace(goingDetails) {
    let confirm = this.alertCtrl.create({
      title: "Add yo your to Do list?",
      message: `Do you want to go to ${this.placeDetails.name} on ${goingDetails.date}`,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.serverEmmiter.addOwnEvent({
              placeDetails: this.placeDetails,
              goingDetails: goingDetails
            }).subscribe(
              data => {
                console.log("data", data);
                this.showAlert("Success", "Now event is in your toDoList");
              },
              error => {

              }
              )
          }
        }
      ]
    })

    confirm.present();
  }
  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'add-circle';
    } else {
      data.showDetails = true;
      data.icon = 'remove-circle';
    }
  }
  showAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

}
