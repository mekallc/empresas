import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ServicesListComponent } from './services-list.component';



@NgModule({
  exports: [ServicesListComponent],
  declarations: [ServicesListComponent],
  entryComponents: [ServicesListComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ServicesListHistoryModule { }
