import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';

const routes = [
  {
    path: 'Utilisateurs',
    component: UtilisateurComponent
  }
];


@NgModule({
  declarations: [UtilisateurComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseWidgetModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CommonModule,
    MatTabsModule,
    NgxDatatableModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AdministrationModule { }
