import { filter } from 'rxjs/operators';
import { IndexApiService } from '../../../../_services/index-api.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { indexOf } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

class obj {
  constructor() { }
  id: string;
  nom: string;
  prenom: string;
  email: string;
  //date_creation: string;
  //date_modification: string;
  enabled: string;
  roles: [];
  //sigle: string;
  personnel: string;
  //isselected: false;
  user: true;
  auditeur: false;
  chef_mission: false;
  chef_hierarchique: false;
}

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {

  UtilisateurformModif: FormGroup;
  PswformModif: FormGroup;

  NouvelItem: boolean;
  NouvelMotdepasse: boolean;
  currentItem: any;
  //selectedItem: any;

  afficherboutonModif: Boolean;
  afficherboutonSupr: Boolean;
  afficherboutonSave: Boolean;
  afficherboutonAnnule: Boolean;
  //isselected: Boolean;
  checkedItem: String[];

  afficherFormModif: Boolean;
  afficherFormpassword: Boolean;

  loadingIndicator: boolean;
  reorderable: boolean;

  rows_recherche: any[];
  rows_user: any[];
  allPersonnel: any[];
  selected = [];
  tab: string[];
  data = new obj;
  utilisateur: any;
  private _unsubscribeAll: Subject<any>;

  columnsUtilisateurs = [
    { name: 'Nom', prop: 'anarana' },
    { name: 'Prenom', prop: 'prenom' },
    { name: 'Email', prop: 'email' },
    { name: 'Roles', prop: 'roles' },
    { name: 'Etat', prop: 'enabled' },
    { name: 'Personnel', prop: 'personnel.nom' }
    //{ name: 'Personnel', prop: 'personnel.nom' }
  ];

  constructor(private _formbuilder: FormBuilder, public dialog: MatDialog, private index_api: IndexApiService) { this._unsubscribeAll = new Subject(); }

  @ViewChild('ajoutDialog', { static: true }) ajoutDialog: TemplateRef<any>;
  @ViewChild('modifDialog', { static: true }) modifDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.NouvelItem = false;
    this.afficherboutonModif = false;
    this.afficherboutonModif = false;
    this.afficherFormModif = false;
    this.afficherFormpassword = false;
    this.selected = [];
    this.utilisateur = {};


    this.UtilisateurformModif = this._formbuilder.group(
      {
        id: [''],
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', Validators.required],
        //date_creation: ['', Validators.required],
        personnel: ['', Validators.required],
        // date_modification: ['', Validators.required],
        enabled: ['', Validators.required],
        //roles: ['', Validators.required],
        //sigle: ['', Validators.required],
        user: [true],
        auditeur: [false],
        chef_mission: [false],
        chef_hierarchique: [false]

      }
    );
    this.PswformModif = this._formbuilder.group(
      {
        psw: ['', Validators.required],
        psw_confirm: ['', [Validators.required, confirmPasswordValidator]],
      },
      //ValidatorFn: MustMatch('pasw', 'psw_confirm')
    )
    this.PswformModif.get('psw').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.PswformModif.get('psw_confirm').updateValueAndValidity();
      });

    this.index_api.getAll('Utilisateurs').subscribe((response) =>// Utilisateurs = nom_controller php
    {
      //console.log(response);
      this.rows_user = response['response'];
      this.rows_recherche = this.rows_user;
      this.loadingIndicator = false;
    });
    this.index_api.getAll('personnel').subscribe((response) => {
      this.allPersonnel = response['response'];
    });
  }

  AjoutFormUtilisateur() {
    this.NouvelItem = true;
    this.afficherFormModif = true;

    this.afficherboutonModif = false;
    this.afficherboutonSupr = false;
    this.afficherboutonSave = true;
    this.afficherboutonAnnule = true;

    let cli = {
      id: null,
      nom: null,
      prenom: null,
      email: null,
      //date_creation: null,
      //date_modification: null,
      enabled: null,
      roles: null,
      sigle: null,
      personnel: null,
      isselected: null
    }
    //this.dialog.open(this.ajoutDialog, { disableClose: true, data: cli })
  }

  ModifFormUtilisateur() {
    this.NouvelItem = false;
    this.afficherboutonModif = false;
    this.afficherboutonSupr = false;
    this.afficherboutonSave = true;
    this.afficherboutonAnnule = true;
    this.afficherFormModif = true;

    let audi = false;
    let chfhier = false;
    let chfmiss = false;

    if (this.selected[0].roles.indexOf("audi") != -1) {
      audi = true;
    }
    if (this.selected[0].roles.indexOf("chfhier") != -1) {
      chfhier = true;
    }
    if (this.selected[0].roles.indexOf("chfmiss") != -1) {
      chfmiss = true;
    }

    this.utilisateur = {
      id: this.selected[0].id,
      nom: this.selected[0].anarana,
      prenom: this.selected[0].prenom,
      email: this.selected[0].email,
      // date_creation: new Date(this.selected[0].date_creation),// ovaina forme date
      //date_modification: new Date(this.selected[0].date_modification),
      enabled: this.selected[0].enabled,
      roles: this.selected[0].roles,
      auditeur: audi,
      chef_mission: chfmiss,
      chef_hierarchique: chfhier,
      //sigle: this.selected[0].sigle,
      personnel: this.selected[0].personnel.id
    }
    //this.dialog.open(this.modifDialog, { disableClose: true, data: this.utilisateur })
  }



  affichage_etat(enabled) {
    if (enabled == 0) {
      return "INACTIF";
    }
    return "ACTIF";
  }

  supprimerUser() {
    this.NouvelItem = false;
    this.ajoutUser(this.selected[0], 1);

  }

  CheckedChefMission(e, role) {
    if (e.checked == true) {
      this.utilisateur.roles.push("chfmiss");
      console.log(this.utilisateur.roles);
    } else {
      this.utilisateur.roles = this.utilisateur.roles.filter((obj) => {
        return obj !== 'chfmiss';
      });
      console.log(this.utilisateur.roles);
    }
  }

  CheckedChefHierarchique(e, role) {
    if (e.checked == true) {
      this.utilisateur.roles.push("chfhier");
      console.log(this.utilisateur.roles);
    } else {
      this.utilisateur.roles = this.utilisateur.roles.filter((obj) => {
        return obj !== 'chfhier';
      });
      console.log(this.utilisateur.roles);
    }
  }

  CheckedAuditeur(e, role) {
    //console.log(e.checked);
    //console.log(e.value);
    //console.log(e.source.value);
    // console.log(this.utilisateur.roles);
    console.log(this.rows_user);
    if (role == 'auditeur') {
      if (e.checked == true) {
        this.utilisateur.roles.push("audi");
        console.log(this.utilisateur.roles);
      } else {
        this.utilisateur.roles = this.utilisateur.roles.filter((obj) => {
          return obj !== 'audi';
        });
        console.log(this.utilisateur.roles);
      }
    }
  }

  rechercher_utilisateurs(event) {
    /*const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.rows_user.filter(function (d) {
      return d.anarana.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    if (temp) {
      this.rows_user = temp;
    }
    return this.rows_user;
    // Whenever the filter changes, always go back to the first page*/
    const val = event.target.value.toLowerCase();

    this.rows_user = this.rows_recherche;

    let keys = Object.keys(this.rows_user[0]);
    let colsAmt = this.columnsUtilisateurs.length;

    this.rows_user = this.rows_user.filter(function (obj) {

      if (val) {
        //return obj.libelle.toLowerCase().indexOf(val)!==-1 || !val;

        for (let i = 0; i < colsAmt; i++) {

          // check for a match

          if (obj[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {

            // found match, return true to add to result set

            return true;

          }

        }

      }
      else
        return obj[keys[0]].toString().substring(0, 1) !== '';
    });
  }


  //mamorona insert 1

  ajoutUser(donne, suppression) {
    console.log(donne);
    this.insert_in_base(donne, suppression);

  }

  insert_in_base = function (donne, suppression) {
    let getId = 0; //nouveau ajout
    //console.log(this.NouvelItem);
    if (this.NouvelItem == false) {
      getId = this.selected[0].id; //modification
      //console.log(getId);
    }
    let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' } };

    let data =
    {
      id: getId,
      supprimer: suppression,
      nom: donne.nom,
      prenom: donne.prenom,
      email: donne.email,
      //date_creation: this.convertionDate(donne.date_creation),
      //date_modification: this.convertionDate(donne.date_modification),
      enabled: donne.enabled,
      roles: JSON.stringify(donne.roles),
      // sigle: donne.sigle,
      personnel: donne.personnel,
      gestion_utilisateur: 1
    }
    //console.log(data);

    let insert_data = this.serializeData(data);
    // console.log(insert_data);

    this.index_api.add('Utilisateurs', insert_data, config).subscribe((response) => {
      //this.selectedItem.nom_client=client.nom_client;
      //console.log(response);
      if (this.NouvelItem == false) {
        // Update or delete: id exclu                    
        if (suppression == 0) {
          let pers = this.allPersonnel.filter((obj) => {
            return obj.id == donne.personnel; // filtre personnel pour la modification
          });
          this.selected[0].personnel = pers[0];
          this.selected[0].nom = donne.nom;
          this.selected[0].prenom = donne.prenom;
          this.selected[0].email = donne.email;
          // this.selected[0].date_creation = donne.date_creation;
          // this.selected[0].date_modification = donne.date_modification;
          this.selected[0].enabled = donne.enabled;
          this.selected[0].roles = donne.roles;
          this.selected[0].sigle = donne.sigle;
        }
        else {
          this.rows_user = this.rows_user.filter((obj) => {
            return obj.id !== this.currentItem.id;
          });
          this.rows_user = [...this.rows_user];
          this.selected = [];
          this.afficherboutonModifSupr = false;
        }
      }
      else {// nouveau ajout
        let item = {
          id: String(response.response),
          nom: donne.nom,
          prenom: donne.prenom,
          email: donne.email,
          // date_creation: this.convertionDate(donne.date_creation),
          //date_modification: this.convertionDate(donne.date_modification),
          enabled: donne.libelle,
          roles: donne.code,
          sigle: donne.sigle,
          personnel: donne.libelle
        };
        this.rows_user.unshift(item);
        this.rows_user = [...this.rows_user];
        this.NouvelItem = false;
      }
      this.afficherFormModif = false;
      this.dialog.closeAll();
    }, error => {
      console.log("erreur");
      this.dialog.closeAll();
    });
    this.afficherFormModif = false;
    this.afficherboutonModif = false;
    this.afficherboutonSupr = false;
    this.afficherboutonSave = false;
    this.afficherboutonAnnule = false;
  }

  public test_existance = function (item, suppression) {
    if (suppression != 1) {
      this.rows_user.forEach((user) => {
        console.log("item", item);
        console.log("user", user);
        if (user.id == item.id) {
          //console.log("user roles", user.roles);
          // console.log("item roles", item.roles);
          console.log("item", item);
          console.log("user", user);
          if ((user.nom != item.nom)
            || (user.prenom != item.prenom)
            || (user.email != item.email)
            // || (user.date_creation != item.date_creation)
            //|| (user.date_modification != item.date_modification)
            || (user.enabled != item.enabled)
            || (user.roles != item.roles)) {
            // console.log('test');
            //this.insert_in_base(item, suppression);
          }
          else {
            console.log("mitovy");
            this.afficherFormModif = false;
          }
        }
      });
    }
    else {
      this.insert_in_base(item, suppression);
    }
  }

  annulermodal() {
    //this.dialog.closeAll();
    this.afficherFormModif = false;
    this.afficherFormpassword = false;
    this.afficherboutonModif = false;
    this.afficherboutonSupr = false;
    this.afficherboutonSave = false;
    this.afficherboutonAnnule = false;
  }

  onSelectUtilisateur(event) {
    //this.selectedItem = event.selected[0];
    this.currentItem = JSON.parse(JSON.stringify(event.selected[0]));
    this.afficherboutonModif = true;
    this.afficherboutonSupr = true;
    this.afficherboutonSave = false;
    this.afficherboutonAnnule = false;

  }

  //serialized mitovy @ $.param()
  private serializeData(data) {
    var buffer = [];
    // Serialize each key in the object.
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }

      var value = data[name];
      buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
    }

    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join("&").replace(/%20/g, "+");
    return (source);
  }

  public convertionDate(daty) {
    if (daty) {
      let date = new Date(daty);
      let jour = date.getDate();
      let mois = date.getMonth() + 1;
      let annee = date.getFullYear();
      var date_final;
      if (mois < 10) {
        date_final = annee + "-" + "0" + mois + "-" + jour;
      }
      else {
        date_final = annee + "-" + mois + "-" + jour;
      }

      return date_final
    }
  }

  formatDate(daty) {
    if (daty) {
      var date = new Date(daty);
      var mois = date.getMonth() + 1;
      var dates = (date.getDate() + "-" + mois + "-" + date.getFullYear());
      return dates;
    }
  }

  ModifFormpsw() {
    this.NouvelItem = false;
    this.afficherboutonModif = false;
    this.afficherboutonSupr = false;
    this.afficherboutonSave = true;
    this.afficherboutonAnnule = true;
    this.afficherFormpassword = true;
    let data = {
      id: null,
      email: null,
      psw: null,
      psw_confirm: null,
    }
  }

  modificationPassword(data, suppression) {

    this.NouvelMotdepasse = false;

    let getId = 0;
    if (this.NouvelMotdepasse == false) {
      getId = this.selected[0].id;
    }
    let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' } };

    let donnee =
    {
      id: getId,
      supprimer: suppression,
      email: this.selected[0].email,
      password: data.psw,
      majmdp: 1,
    }

    let insert_data_psw = this.serializeData(donnee);
    //console.log(insert_data_psw);
    this.index_api.add('Utilisateurs', insert_data_psw, config).subscribe((response) => {
      this.afficherFormModif = false;
      this.afficherboutonModif = false;
      this.afficherboutonSupr = false;
      this.afficherboutonSave = false;
      this.afficherboutonAnnule = false;
    }, error => {
      console.log("erreur");
    });
  }

}


export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('psw');
  const passwordConfirm = control.parent.get('psw_confirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };

};

