import { Routes, RouterModule } from '@angular/router';

const app: Routes = [
  {
    path: 'soporte',
    loadChildren: () => import('./pages/soporte/soporte.module').then( m => m.SoporteChatPageModule)
  }
];

export const chatRoute = RouterModule.forChild(app);
