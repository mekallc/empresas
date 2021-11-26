import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterUserPage } from '@modules/users/pages/register-user/register-user.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterUserPageRoutingModule {}
