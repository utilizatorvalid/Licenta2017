import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ToDo } from './to-do';

@NgModule({
  declarations: [
    ToDo,
  ],
  imports: [
    IonicPageModule.forChild(ToDo),
  ],
  exports: [
    ToDo
  ]
})
export class ToDoModule {}
