import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceComponent } from './place';

@NgModule({
  declarations: [
    PlaceComponent,
  ],
  imports: [
    IonicPageModule.forChild(PlaceComponent),
  ],
  exports: [
    PlaceComponent
  ]
})
export class PlaceComponentModule {}
