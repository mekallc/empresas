import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { ServicesOpenWidgetComponent } from './services-open-widget.component';
import { WaitingModule } from '@modules/categories/pages/waiting/waiting.module';

@NgModule({
  exports: [ServicesOpenWidgetComponent],
  declarations: [ServicesOpenWidgetComponent],
  entryComponents: [ServicesOpenWidgetComponent],
  imports: [
    IonicModule,
    CommonModule,
    MomentModule,
    WaitingModule
  ]
})
export class ServicesOpenWidgetModule { }
