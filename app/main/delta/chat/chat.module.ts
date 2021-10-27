import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { ChatComponent } from './chat.component';
import { AuthGuard } from '../../../_helpers/auth.guard';
import { RouterModule } from '@angular/router';
//import { ChatUsersComponent } from './chat-users/chat-users.component';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';

import { FuseSharedModule } from '@fuse/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const routes = [
  {
      path     : 'chat',
      component: ChatComponent, canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    FuseSharedModule,
    
MatButtonModule,
MatFormFieldModule,
MatIconModule,
MatInputModule ,
MatListModule,
MatMenuModule,
MatRadioModule,
FlexLayoutModule,
NgxDatatableModule
  ],
  providers:[DatePipe]
})
export class ChatModule { }
