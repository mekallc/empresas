import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { userRoute } from './users.routes';


@NgModule({
  declarations: [],
  imports: [
    userRoute,
    CommonModule
  ]
})
export class UsersModule { }
