import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

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
    WaitingModule,
    TranslateModule,
  ]
})
export class ServicesOpenWidgetModule { }
