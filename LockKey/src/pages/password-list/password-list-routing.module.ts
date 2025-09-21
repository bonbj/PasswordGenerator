import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordListPage } from './password-list.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordListPageRoutingModule {}
