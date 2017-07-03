import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';

/**
 * Generated class for the CityComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'city',
  templateUrl: 'city.html',
})
export class CityComponent {
  @Input() cityObj;
  text: string;
  city: any;
  private endpoint:String = "https://maps.googleapis.com/maps/api/place/photo?"
  private googlePlacesKey:String = "AIzaSyASKxzBYOd4WcgvwAnebFN9vnlSYmWSGU0"
  constructor(public modalCtrl: ModalController) {
    console.log('Hello CityComponent Component');

  }

  ngOnInit() {
    this.city = this.cityObj;
    let coverPhoto = this.city.photos[0];
    // this.city['img']=`${this.endpoint}maxwidth=${coverPhoto.width}&photoreference=${coverPhoto.photo_reference}&key=${this.googlePlacesKey}`
    
    this.city['img']=`${this.endpoint}maxwidth=${coverPhoto.width}&photoreference=${coverPhoto.photo_reference}&key=${this.googlePlacesKey}`
    console.log(">>>>>>>>", this.cityObj);
  }
  openGalleryModal(event:Event) {
    console.log("initModal")
    let photos = []
    this.city.photos.forEach(photo => {
        // url:`${this.endpoint}maxwidth=${photo.width}&photoreference=${photo.photo_reference}&key=${this.googlePlacesKey}`
      
      photos.push({
        url:`${this.endpoint}maxwidth=${photo.width}&photoreference=${photo.photo_reference}&key=${this.googlePlacesKey}`
      })
      
    });
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: 0 
    });
    modal.present();
    event.stopImmediatePropagation();
  }

}
