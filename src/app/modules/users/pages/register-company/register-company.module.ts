import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterCompanyPage } from './register-company.page';
import { RegisterCompanyPageRoutingModule } from './register-company-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RegisterCompanyPageRoutingModule
  ],
  declarations: [RegisterCompanyPage]
})
export class RegisterCompanyPageModule {}
