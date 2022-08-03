import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';
import { OnOffWidgetModule } from '@core/widgets/on-off-widget/on-off-widget.module';
import { RatingModalModule } from '@modules/rate/pages/rating-modal/rating-modal.module';

const app: Routes = [
  { path: '', component: WaitingComponent }
];

@NgModule({
  exports: [WaitingComponent],
  declarations: [WaitingComponent],
  entryComponents: [WaitingComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    RatingModalModule,
    OnOffWidgetModule,
    RouterModule.forChild(app),
  ]
})
export class WaitingModule { }

