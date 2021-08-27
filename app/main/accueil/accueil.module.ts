import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '../../_helpers/auth.guard';
const routes = [
  {
      path     : 'accueil',
      component: AccueilComponent, canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [AccueilComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    TranslateModule,

    FuseSharedModule
  ],
  exports     : [
      AccueilComponent
  ]
})
export class AccueilModule { }
