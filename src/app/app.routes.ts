import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'user/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('@modules/users/users.module').then( m => m.UsersModule)
  },

];


export const appRoute = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
