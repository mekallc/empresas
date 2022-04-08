import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RatingModalComponent } from './rating-modal.component';
import { StarsWidgetModule } from '@modules/categories/widgets/stars/stars.module';

@NgModule({
  exports: [RatingModalComponent],
  declarations: [RatingModalComponent],
  entryComponents: [RatingModalComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    StarsWidgetModule
  ]
})
export class RatingModalModule { }
