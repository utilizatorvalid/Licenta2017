import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerEmmiter } from '../../services/server-emmiter/server-emmiter.service'
import { EventDetails } from '../event-details/event-details'
import { AuthService } from '../../services/auth/auth.service'
import { Storage } from '@ionic/storage'
import { ToastController, ToastOptions } from 'ionic-angular'
import {MapPage} from '../map/map'
/**
 * Generated class for the EventListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage {
  eventsToDisplay:Array<Object>;
  events: Array<Object>;
  selectedCategory: string = 'all';
  // eventTypes:Array<{name:string, tags: Array<string>}>
  eventTypes:Object;
  categories = ['all', 'music', 'personal', 'theater_cinema']
  storage: Storage = new Storage('localstorage')
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public serviceEmmiter: ServerEmmiter,
    public authService: AuthService,
    private toastCtrl: ToastController) {
      this.eventTypes = {};
      this.eventTypes['all']={
        name:"All Events",
        value:'all',
        tags:['']
      };
      this.eventTypes['music']={
        name:"Music",
        value:'music',
        tags:['music','muzica', 'concert']
      }
      this.eventTypes['personal']={
        name:'Personal Growth',
        value:'personal',
        tags:['curs', 'seminar']
      };
      this.eventTypes['theater_cinema']={
        name:'Theater & Cinema',
        value:'theater_cinema',
        tags:['spectacol','film']
      }
      this.eventsToDisplay = [];
      
    this.storage.get('radius')
      .then(radius => {
        if (!radius)
          radius = 3;
        this.storage.get('nrDays')
          .then((nrDays) => {

            if (!nrDays)
              nrDays = 7;
            this.loadEvents(radius, nrDays);
          });
      })
      .catch(error => {
        console.log(error);
      })
    // console.log(">>>>>>>>",this.authService.user);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventListPage');
  }
  onSegmentChange(event:Event){
    this.eventsToDisplay = [];
    this.events.forEach(event => {

      let ok = false;
      let searched_tags = this.eventTypes[this.selectedCategory].tags
      console.log("NEW SEGMENT", this.selectedCategory, searched_tags);
      
      searched_tags.forEach(tag => {
        if(event['description'].indexOf(tag)!=-1)
        {
          ok = true;
        }
      });
      if(ok){
        this.eventsToDisplay.push(event);
      }
      
    });

  }
  loadEvents(radius, nrDays) {
    let timeNow = new Date();
    let timeEnd = new Date(Date.now() + nrDays * 24 * 60 * 60 * 1000)

    // console.log(timeNow.toISOString())
    // console.log(timeEnd.toISOString())

    this.serviceEmmiter.loadAllEvents({
      mgrs: this.authService.user.mgrs_currentLocation,
      startTime: timeNow.toISOString(),
      endTime: timeEnd.toISOString(),
      radius: radius
    })
      .subscribe(
      data => {
        this.events = data["events"];
        console.log(data);
        console.log("events loaded", this.authService);
        this.eventsToDisplay = this.events;
        let toast = this.toastCtrl.create({
          message: `${this.events.length} event(s) was loaded successfully`,
          duration: 3000,
          position: 'bottom',
          cssClass: ' oktoast '
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
        toast.present();
      },
      error => {
        console.log("error wile loading events");
      })

  }

  eventTapped(e, event) {
    console.log("open event detail page for:", event)
    console.log(this.navCtrl.getActive().name);
    this.navCtrl.push(EventDetails, {
      "event": event,
      "prevPage": this.navCtrl.getActive().name
    });

  }
  openMaps(event:Event, e) {
    this.navCtrl.push(MapPage,
      {
        event: e
      });
    event.stopImmediatePropagation();
    
  }
  remainingHours(startTime): String {
    var start = new Date(startTime);
    var now = new Date(Date.now());

    var hours = Math.trunc((start.getTime() - now.getTime()) / 36e5);
    var days = Math.trunc(hours / 24);
    var h = hours % 24
    let time = `${days} days & ${h} hours until start`
    // console.log(hours);
    return time;
  }
  getDate(t: string): String {
    var d = new Date(t)
    return d.toDateString()
  }

}
