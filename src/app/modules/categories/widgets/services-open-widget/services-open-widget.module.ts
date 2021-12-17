import { ServicesOpenWidgetComponent } from './services-open-widget.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  exports: [ServicesOpenWidgetComponent],
  declarations: [ServicesOpenWidgetComponent],
  entryComponents: [ServicesOpenWidgetComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ServicesOpenWidgetModule { }
