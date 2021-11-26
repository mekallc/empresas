import { Routes, RouterModule } from '@angular/router';

const app: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/register-user/register-user.module').then( m => m.RegisterUserPageModule)
  },
  {
    path: 'register-company',
    loadChildren: () => import('./pages/register-company/register-company.module').then( m => m.RegisterCompanyPageModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./widgets/maps/maps.module').then( m => m.MapsUserWidgetModule)
  },
];

export const userRoute = RouterModule.forChild(app);
