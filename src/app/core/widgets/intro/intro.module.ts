import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { IntroWidgetComponent } from './intro.component';


@NgModule({
  declarations: [IntroWidgetComponent],
  exports: [IntroWidgetComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
  ]
})
export class IntroWidgetModule { }
