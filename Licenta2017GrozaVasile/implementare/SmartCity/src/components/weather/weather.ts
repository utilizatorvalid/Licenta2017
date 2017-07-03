import { Component, Input} from '@angular/core';

/**
 * Generated class for the WeatherComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'weather',
  templateUrl: 'weather.html'
})
export class WeatherComponent {

  @Input() dayForecast;
  @Input() indexToUse;
  @Input() tempUnit;
  day: any;
  index: number;
  temperatureUnit:String;
  constructor() {
  }

  getDate(){

    let today = new Date(Date.now() + this.indexToUse * 24 * 60 * 60 * 1000)
    // console.log(today);
    return today.toDateString();    
  }

  ngOnInit(){
    console.log(this.dayForecast);
    this.day = this.dayForecast;
    this.index = this.indexToUse;
    this.temperatureUnit = this.tempUnit;

  }
}

// <weather></weather
