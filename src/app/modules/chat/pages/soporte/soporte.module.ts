import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SoporteChatPage } from './soporte.page';
import { SoporteChatPageRoutingModule } from './soporte-routing.module';
import { HeaderModule } from '@core/widgets/header/header.module';


@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    HeaderModule,
    SoporteChatPageRoutingModule
  ],
  exports: [SoporteChatPage],
  declarations: [SoporteChatPage],
  entryComponents: [SoporteChatPage]
})
export class SoporteChatPageModule {}
