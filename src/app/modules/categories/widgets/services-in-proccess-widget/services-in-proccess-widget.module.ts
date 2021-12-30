import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesInProccessWidgetComponent } from './services-in-proccess-widget.component';



@NgModule({
  exports: [ServicesInProccessWidgetComponent],
  declarations: [ServicesInProccessWidgetComponent],
  entryComponents: [ServicesInProccessWidgetComponent],
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class ServicesInProccessWidgetModule { }
