import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartUpPage } from './start-up-page';
@NgModule({
  declarations: [
    StartUpPage,
  ],
  imports: [
    IonicPageModule.forChild(StartUpPage),
  ],
  exports: [
    StartUpPage
  ]
})
export class StartUpPageModule {}
