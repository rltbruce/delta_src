import { AdministrationModule } from './main/delta/administration/administration.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AuthModule } from 'app/main/auth/auth.module';
import { DeboursModule } from 'app/main/delta/ddb/debours/debours.module';
import { SectionModule } from 'app/main/delta/ddb/section/section.module';
import { GradeModule } from 'app/main/delta/ddb/grade/grade.module';
import { ProduitModule } from 'app/main/delta/ddb/produit/produit.module';
import { ClientModule } from 'app/main/delta/ddb/client/client.module';
import { TacheModule } from 'app/main/delta/ddb/tache/tache.module';
import { PersonnelModule } from 'app/main/delta/ddb/personnel/personnel.module';
import { MissionModule } from 'app/main/delta/ddb/mission/mission.module';
import { AlertComponent } from './_components/alert/alert.component';
import { LoginComponent } from './main/auth/login/login.component';
import { SampleComponent } from '../app/main/sample/sample.component';
import { AccueilModule } from 'app/main/accueil/accueil.module';

/* AUTH */
import { JwtInterceptor } from '../app/_helpers/jwt.interceptor';
import { ErrorInterceptor } from '../app/_helpers/error.interceptor';
import { AuthGuard } from '../app/_helpers/auth.guard';
//import { AccueilComponent } from './main/accueil/accueil.component';
/* FIN AUTH */
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClientComponent } from './main/delta/ddb/client/client.component';
import { TacheComponent } from './main/delta/ddb/tache/tache.component';
import { PersonnelComponent } from './main/delta/ddb/personnel/personnel.component';
import { MissionComponent } from './main/delta/ddb/mission/mission.component';
import { TimeSheetModule } from './main/delta/time-sheet/time-sheet.module';


const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'accueil'
    }

];
//export const appRoutingModule = RouterModule.forRoot(appRoutes);
@NgModule({
    declarations: [
        AppComponent,
        AlertComponent


    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,
        DeboursModule,
        GradeModule,
        ProduitModule,
        ClientModule,
        TacheModule,
        PersonnelModule,
        MissionModule,
        SectionModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        AuthModule,
        MatDialogModule,
        AccueilModule,
        TimeSheetModule,
        AdministrationModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },


    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
