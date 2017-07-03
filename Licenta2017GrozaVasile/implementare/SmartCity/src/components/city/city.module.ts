import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CityComponent } from './city';

@NgModule({
  declarations: [
    CityComponent,
  ],
  imports: [
    IonicPageModule.forChild(CityComponent),
  ],
  exports: [
    CityComponent
  ]
})
export class CityComponentModule {}
