import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@modules/users/services/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/home',
    pathMatch: 'full'
  },
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('@modules/users/users.module').then( m => m.UsersModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('@modules/chat/chat.module').then( m => m.ChatModule)
  },

];


export const appRoute = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
