import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceListComponent } from './place-list';

@NgModule({
  declarations: [
    PlaceListComponent,
  ],
  imports: [
    IonicPageModule.forChild(PlaceListComponent),
  ],
  exports: [
    PlaceListComponent
  ]
})
export class PlaceListComponentModule {}
