import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PasswordListPageRoutingModule } from './password-list-routing.module';
import { PasswordListPage } from './password-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordListPageRoutingModule
  ],
  declarations: [PasswordListPage]
})
export class PasswordListPageModule {}
