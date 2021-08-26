import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../_helpers/auth.guard';
import { MissionComponent } from './mission.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';


const routes = [
  {
      path     : 'mission',
      component: MissionComponent, canActivate: [AuthGuard]
  }
];

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
}; 

@NgModule({
  declarations: [
    MissionComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    FuseSharedModule,
    FuseWidgetModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
      //  MatMomentDateModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
       // MatNativeDateModule,
        CommonModule,
        MatTabsModule,
        NgxDatatableModule,
        MatDialogModule
  ],/*,
  providers   : [
    DeboursService
    
]*/
providers: [
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
]
 
})
export class MissionModule 
{

 }
