import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { HeaderModule } from '@core/widgets/header/header.module';
import { RegisterCompanyPageModule } from '@modules/users/pages/register-company/register-company.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    HomePageRoutingModule,
    RegisterCompanyPageModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
