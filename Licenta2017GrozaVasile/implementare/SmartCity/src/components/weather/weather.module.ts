import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherComponent } from './weather';

@NgModule({
  declarations: [
    WeatherComponent,
  ],
  imports: [
    IonicPageModule.forChild(WeatherComponent),
  ],
  exports: [
    WeatherComponent
  ]
})
export class WeatherComponentModule {}
