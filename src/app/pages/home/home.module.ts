import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderModule } from '@core/widgets/header/header.module';
import { BannersWidgetModule } from '@core/widgets/banners/banners.module';
import { ServicesOpenWidgetModule } from '@modules/categories/widgets/services-open-widget/services-open-widget.module';


@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    HeaderModule,
    CommonModule,
    BannersWidgetModule,
    HomePageRoutingModule,
    ServicesOpenWidgetModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
