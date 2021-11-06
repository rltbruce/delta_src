import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import {  AuthenticationService } from '../../_services/authentification.service';
import { IndexApiService } from '../../_services/index-api.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
//import { Subject,interval, Subscription } from 'rxjs';

@Component({
  selector: 'accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {

  currentUser: User;

    users = [];
    //badge_chat: Subscription;
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService, private authenticationService: AuthenticationService,
        private userService: UserService,
        private index_api: IndexApiService,
        private _fuseNavigationService: FuseNavigationService
    )
    {
        this.currentUser = this.authenticationService.currentUserValue;

        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
           /* this.index_api.getgeneralise("chat","?menu=getnumbermessagechat&id_user="+this.currentUser.id).subscribe(resp =>
              {
                let  nbr_message= resp.response;
                this._fuseNavigationService.updateNavigationItem('chat', {
                    badge: {title:parseInt(nbr_message[0].nbr),
                      bg       : '#F44336',
                      fg       : '#FFFFFF'}
                });
                
                console.log(nbr_message);   
              });        
            this.badge_chat = interval(10000).subscribe((func => {
              this.index_api.getgeneralise("chat","?menu=getnumbermessagechat&id_user="+this.currentUser.id).subscribe(resp =>
              {
                let  nbr_message= resp.response;
                this._fuseNavigationService.updateNavigationItem('chat', {
                    badge: {title:parseInt(nbr_message[0].nbr),
                        bg   : '#09d261',
                        fg   : '#FFFFFF'}
                });
                
                console.log(nbr_message);   
              });
            }))*/
    }

}
