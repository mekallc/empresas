import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterUserPage } from './register-user.page';
import { RegisterUserPageRoutingModule } from './register-user-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RegisterUserPageRoutingModule
  ],
  declarations: [RegisterUserPage]
})
export class RegisterUserPageModule {}
