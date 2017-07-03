import { Component, Input } from '@angular/core';

/**
 * Generated class for the PlaceListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'place-list',
  templateUrl: 'place-list.html'
})
export class PlaceListComponent {

  text: string;

  @Input() placesObj;
  private places
  constructor() {
    console.log('Hello PlaceListComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(){
    console.log(this.placesObj);
    this.places = this.placesObj;
  }

}
