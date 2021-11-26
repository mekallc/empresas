import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MapsWidgetComponent } from './maps.component';
const app: Routes = [
  { path: '', component: MapsWidgetComponent }
];


@NgModule({
  exports: [MapsWidgetComponent],
  declarations: [MapsWidgetComponent],
  entryComponents: [MapsWidgetComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(app),
  ]
})
export class MapsUserWidgetModule { }
