import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { Event } from '../../models/event'
import { ServerEmmiter } from '../../services/server-emmiter/server-emmiter.service'
import { EventDetails } from '../event-details/event-details'

/**
 * Generated class for the ToDo page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-to-do',
  templateUrl: 'to-do.html',
})
export class ToDo {
  events : Array<Object>
  category: string = 'gear';
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public serverEmmiter: ServerEmmiter) {
    this.loadEvents();
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventListPage');
  }

  loadEvents(){
    this.serverEmmiter.getUserEvents()
    .subscribe(data=>{
      this.events = data.events;
      console.log(data);
      console.log("events loaded")
    },
    error=>{
      console.log("failed to load toDoList")
      this.events = []
    })
  }

  eventTapped(e, event){
    console.log("open event detail page for:", event)
    this.navCtrl.push(EventDetails,{
      "event":event,
      "prevPage":this.navCtrl.getActive().name
    });

  }
remainingHours(startTime): String {
    var start = new Date(startTime);
    var now = new Date(Date.now());

    var hours = Math.trunc((start.getTime() - now.getTime()) / 36e5);
    var days = Math.trunc(hours/24);
    var h = hours % 24
    let time = `${days} days & ${h} hours until start`
    // console.log(hours);
    return time;
  }
  getDate(t:string):String{
    var d = new Date(t)
    return d.toDateString()
  }

  doRefresh(e){
    // this.loadEvents();
    this.serverEmmiter.getUserEvents()
    .subscribe(
      data=> {
        this.events = [];
        this.events.unshift(...data.events)
        console.log("events refresh end")
      },
      error=>{
        
        console.log(error)
        e.complete()
      },
      ()=> e.complete()
    )
  }
  doInfinite(e){
    // this.loadEvents();
    this.serverEmmiter.getUserEvents()
    .subscribe(
      data=> {
        this.events = []
        this.events.push(...data.events)
        console.log("events infinite end")
      },
      error=>{
        console.log("err", error);
        e.complete()  
      },
      ()=> e.complete()
    )
  }

}
