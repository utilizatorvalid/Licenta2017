import { Component, Input } from '@angular/core';
import { ServerEmmiter } from '../../services/server-emmiter/server-emmiter.service'
import { ModalController, NavController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
import { PlaceDetailsPage } from '../../pages/place-details/place-details'
/**
 * Generated class for the PlaceComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'place',
  templateUrl: 'place.html'
})
export class PlaceComponent {

  text: string;
  @Input() placeToDisplay;
  private place;
  loaded = false;
  private placeDetails;
  private endpoint: String = "https://maps.googleapis.com/maps/api/place/photo?"
  private googlePlacesKey: String = "AIzaSyASKxzBYOd4WcgvwAnebFN9vnlSYmWSGU0"
  constructor(private serverEmmiter: ServerEmmiter,
    private modalCtrl: ModalController,
    private navCtrl: NavController) {
    console.log('Hello PlaceComponent Component');
  }

  ngOnInit() {
    this.place = this.placeToDisplay;
    // console.log(this.place);
    this.serverEmmiter.getPlaceInfo(this.place.place_id)
      .subscribe(
      data => {
        this.placeDetails = data.result;
        console.log(this.placeDetails);
        let coverPhoto;
        if (!this.placeDetails.photos)
          coverPhoto = null;
        else
          coverPhoto = this.placeDetails.photos[0];
        if (coverPhoto)
          this.placeDetails['img'] = `${this.endpoint}maxwidth=${512}&photoreference=${coverPhoto.photo_reference}&key=${this.googlePlacesKey}`
        else
          this.placeDetails['img'] = this.serverEmmiter.noPhotoUrl;
        this.loaded = true;

      },
      error => {

      }
      )
  }

  openGalleryModal(event: Event) {
    console.log("initModal")
    let photos = []
    if(!this.placeDetails.photos){
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    this.placeDetails.photos.forEach(photo => {
      photos.push({
        url: `${this.endpoint}maxwidth=${512}&photoreference=${photo.photo_reference}&key=${this.googlePlacesKey}`
      })

    });
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: 0
    });
    modal.present();
    event.preventDefault();
    console.log(event)
  }
  openPlaceDetails(event: any) {
    console.log('Open Place details page')
    // console.log(event.srcEvent);
    this.navCtrl.push(PlaceDetailsPage, {
      'place': this.place,
      'placeDetails': this.placeDetails,
    })
    event.srcEvent.stopPropagation();
    // event.srcEvent
  }
}
