import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import {  AuthenticationService } from '../../_services/authentification.service';
import { IndexApiService } from '../../_services/index-api.service';

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})
export class SampleComponent
{
    currentUser: User;

    users = [];
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService, private authenticationService: AuthenticationService,
        private userService: UserService,
        private index_api: IndexApiService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this.currentUser = this.authenticationService.currentUserValue;

        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}
