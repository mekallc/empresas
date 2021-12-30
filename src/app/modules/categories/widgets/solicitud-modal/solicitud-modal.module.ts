import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SolicitudModalComponent } from './solicitud-modal.component';



@NgModule({
  exports: [SolicitudModalComponent],
  declarations: [SolicitudModalComponent],
  entryComponents: [SolicitudModalComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class SolicitudModalModule { }
