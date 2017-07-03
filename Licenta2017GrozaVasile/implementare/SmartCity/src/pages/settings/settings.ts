import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
/**
 * Generated class for the Settings page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  private initSettings: Object = {};
  private newSettings: Object = {};
  private tempUnit: string;
  private radius: number;
  private nrDays: number;
  storage: Storage = new Storage('localstorage');
  loaded: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    // this.radius = 1;
    // this.tempUnit = 'C'
    console.log(this.loaded);
    this.getSettingsFromStorage((settings) => {
      console.log(settings);
      console.log(this.loaded);
      this.initSettings = settings;
      this.tempUnit = settings.tempUnit;
      this.radius = settings.radius;
      this.nrDays = settings.nrDays;
      this.loaded = true;
    });



  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Settings');
  }
  saveSettings() {

    this.newSettings['tempUnit'] = this.tempUnit;
    this.newSettings["radius"] = this.radius;
    this.newSettings['nrDays'] = this.nrDays;

    this.storage.set('tempUnit', this.tempUnit);
    this.storage.set('radius', this.radius);
    this.storage.set('nrDays', this.nrDays);
    console.log(this.initSettings);
    console.log(this.newSettings);
  }
  getSettingsFromStorage(next) {
    let settings = {

    }
    this.storage.get('tempUnit')
      .then(tempUnit => {
        if (!tempUnit) {
          tempUnit = 'C'
          this.storage.set('tempUnit', 'C').then(result => {
          });
        }
        settings["tempUnit"] = tempUnit
        
        this.storage.get('radius')
          .then(radius => {
            if (!radius) {
              radius = 3;
              this.storage.set('radius', 3).then(result => {
              });
            }
            settings["radius"] = radius
            this.storage.get('nrDays')
              .then((nrDays) => {

                if (!nrDays) {
                  nrDays = 7;
                  this.storage.set('nrDays', 7);
                }
                settings['nrDays'] = nrDays;
                next(settings);
              })


          })
      })
      .catch(err => {
        console.log("error while getting from storage temperature unit");
      })
  }

}
