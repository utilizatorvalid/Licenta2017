import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceFormModalPage } from './place-form-modal';

@NgModule({
  declarations: [
    PlaceFormModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceFormModalPage),
  ],
  exports: [
    PlaceFormModalPage
  ]
})
export class PlaceFormModalPageModule {}
