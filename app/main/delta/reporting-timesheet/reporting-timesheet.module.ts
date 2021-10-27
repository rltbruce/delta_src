import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingTimesheetComponent } from './reporting-timesheet.component';
import { AuthGuard } from '../../../_helpers/auth.guard';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


const routes = [
  {
      path     : 'reportingTimeSheet',
      component: ReportingTimesheetComponent, canActivate: [AuthGuard]
  }
]
@NgModule({
  declarations: [ReportingTimesheetComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatDatepickerModule,
    NgxDatatableModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class ReportingTimesheetModule { }
