import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular'
/**
 * Generated class for the PlaceFormModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-place-form-modal',
  templateUrl: 'place-form-modal.html',
})
export class PlaceFormModalPage {
  private date: Date;
  private startTime: Date;
  private endTime: Date;
  private description:String;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaceFormModalPage');
  }

  setDate(event) {
    console.log(typeof (event), event);
    this.date = new Date(event);

    console.log(this.date);
  }
  closeModal(event: Event) {
    console.log("Close this modal")
      let confirm = this.alertCtrl.create({
        title: "Discard?",
        message: `Do you want cancel?`,
        buttons: [
          {
            text: 'No',
            handler: () => {
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.viewCtrl.dismiss({
                type: 'dismiss'
              })
            }
          }
        ]
      })

      confirm.present();

  }
  passDataBack() {
    console.log(this.startTime);
    this.date.setHours(0);
    this.date.setMinutes(0);
    // let s_time = new Date.parse(this.startTime);
    this.viewCtrl.dismiss({
      type: "ok",
      date: this.date.getTime(),
      notification: 'true',
      startTime: this.startTime,
      endTime: this.endTime,
      description: this.description
    })
  }
}
