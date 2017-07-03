import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPage } from './test';
@NgModule({
  declarations: [
    TestPage,
  ],
  imports: [
    IonicPageModule.forChild(TestPage),
  ],
  exports: [
    TestPage
  ],
  providers:[
  ]
})
export class LocationModule {}
