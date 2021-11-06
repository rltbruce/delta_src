import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { IndexApiService } from '../../../_services/index-api.service';
import { AuthenticationService } from '../../../_services/authentification.service';
import { AlertService } from '../../../_services/alert.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    users = [];
    returnUrl: string; loading = false;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private index_api: IndexApiService,
        private authentificationservice: AuthenticationService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        if (this.authentificationservice.currentUserValue) {
            this.router.navigate(['/']);
        }
    }
    get f() { return this.loginForm.controls; } //maka valeur eo @masque de saisie
    /**
     * name
     */

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentExampleDialog);


        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    openDialogenabled() {
        const dialogRef = this.dialog.open(DialogContentEnabledDialog);


        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    authentification() {

        this.loading = true;
        /* this.index_api.getAll('utilisateurs')
            .subscribe(res => {
                this.users = res.response; 
                console.log(this.users);
                
            }); */

        this.authentificationservice.get_user(this.f.email.value, this.f.password.value).subscribe(res => {

            console.log(res);

            if (res.status === true && parseInt(res.response.enabled) == 1) {
                this.router.navigate([this.returnUrl]);

            }
            else {
                if (res.status === true && parseInt(res.response.enabled) == 0) {

                    this.openDialogenabled();
                    console.log("enabled");
                } else {
                    console.log("mot de passe");
                    this.openDialog();
                }

            }

        },
            error => {
                this.alertService.error(error);

            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
@Component({
    selector: 'dialog_view',
    templateUrl: 'dialog_view.html',
})
export class DialogContentExampleDialog { }
@Component({
    selector: 'dialog_enabled',
    templateUrl: 'dialog_enabled.html',
})
export class DialogContentEnabledDialog { }