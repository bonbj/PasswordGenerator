import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'generate-password',
    loadChildren: () => import('../pages/generate-password/generate-password.module').then( m => m.GeneratePasswordPageModule)
  },
  {
    path: 'password-list',
    loadChildren: () => import('../pages/password-list/password-list.module').then( m => m.PasswordListPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
