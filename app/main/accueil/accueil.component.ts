import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import {  AuthenticationService } from '../../_services/authentification.service';
import { IndexApiService } from '../../_services/index-api.service';

@Component({
  selector: 'accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {

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
        this.currentUser = this.authenticationService.currentUserValue;

        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

}
