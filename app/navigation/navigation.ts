import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    /* {
         id       : 'applications',
         title    : 'DELTA AUDIT',
        // translate: 'NAV.APPLICATIONS',
         type     : 'group',
         icon     : 'apps',
         children : [*/
    {
        id: 'accueil',
        title: 'Accueil',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'item',
        icon: 'home',
        url: '/accueil'



    },
    {
        id: 'chat',
        title: 'Chat',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'item',
        icon: 'home',
        url: '/chat'

    },
    {
        id: 'Administration',
        title: 'Administration',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'collapsable',
        icon: 'home',

        children: [
            {
                id: 'Utilisateurs',
                title: 'Utilisateurs',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                // icon     : 'home',
                url: '/Utilisateurs'

            }


        ]

    },
    {
        id: 'db',
        title: 'Donnees de base',
        // translate: 'NAV.DASHBOARDS',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
            {
                id: 'grd',
                title: 'Grade',
                type: 'item',
                url: '/grade'
            },
            {
                id: 'deb',
                title: 'Debours',
                type: 'item',
                url: '/debours'
            },
            {
                id: 'reg',
                title: 'Region',
                type: 'item',
                url: '/region'
            },
            {
                id: 'prd',
                title: 'Produit',
                type: 'item',
                url: '/produit'
            }
            ,
            {
                id: 'sec',
                title: 'Section',
                type: 'item',
                url: '/section'
            },
            {
                id: 'tch',
                title: 'Audit File',
                type: 'item',
                url: '/tache'
            }
            ,
            {
                id: 'clt',
                title: 'Client',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                // icon     : 'home',
                url: '/client'

            },

            {
                id: 'pers',
                title: 'Personnels',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/personnel'

            }

        ]
    },
    {


        id: 'debours',
        title: 'Debours et Time Sheet',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'collapsable',
        icon: 'home',

        children: [
            {
                id: 'mission',
                title: 'Saisie Contrat et mission',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/mission'

            },

            {
                id: 'debours1',
                title: 'Demande de debours',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/demandedeb'

            },
            {
                id: 'aut',
                title: 'Autorisation de debours',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/apps/dashboards/project'

            },



            {
                id: 'visa',
                title: 'Visa de debours',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/apps/dashboards/project'

            },



            {
                id: 'paie',
                title: 'Paiement de debours',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                // icon     : 'home',
                url: '/apps/dashboards/project'

            },
            {
                id: 'feuille',
                title: 'Time Sheet',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/timeSheet'

            }
        ]
    },
    {
        id: 'documents',
        title: 'Documents inside',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'collapsable',
        icon: 'home',

        children: [
            {
                id: 'dc1',
                title: 'Suivi doc',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                // icon     : 'home',
                url: '/document'

            },
            {
                id: 'dc1',
                title: 'Recherche et Upload',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/apps/dashboards/project'

            }

        ]

    },
    {
        id: 'grh',
        title: 'Ressources humaines',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'collapsable',
        icon: 'home',

        children: [
            {
                id: 'carr',
                title: 'Carriere',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/apps/dashboards/project'

            },
            {
                id: 'cng',
                title: 'Congé',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/conge'

            },
            {
                id: 'abs',
                title: 'Absence',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/absence'

            },
            {
                id: 'prm',
                title: 'Permission',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/apps/dashboards/project'

            }

        ]
    },
    {
        id: 'rpt',
        title: 'Reporting',
        //translate: 'NAV.SAMPLE.TITLE',
        type: 'collapsable',
        icon: 'home',

        children: [
            {
                id: 'tmsheet',
                title: 'Time sheet',
                //translate: 'NAV.SAMPLE.TITLE',
                type: 'item',
                //icon     : 'home',
                url: '/reportingTimeSheet'

            }]
    }
    /*]
}*/
];

