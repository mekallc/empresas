import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagesPage } from './pages.page';
import { pageRoute } from './pages.routes';

@NgModule({
  imports: [
    pageRoute,
    FormsModule,
    IonicModule,
    CommonModule,
  ],
  declarations: [PagesPage]
})
export class PagesPageModule {}
