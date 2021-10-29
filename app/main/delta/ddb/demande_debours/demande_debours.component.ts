import { Component, OnInit,ElementRef,ViewEncapsulation, TemplateRef,ViewChild} from '@angular/core'; //, ViewEncapsulation
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { IndexApiService } from '../../../../_services/index-api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { DataSource } from '@angular/cdk/collections';
import { FuseUtils } from '@fuse/utils';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepicker} from '@angular/material/datepicker';
import { formatNumber } from '@angular/common';
import { DatePipe } from '@angular/common';

class obj
  {
    constructor() {}
    id:         string;
    code:       string;
    libelle: string;
   
    
  }

  function  formatD(date1)
  {
    date1 = new Date(date1);
      var mois = date1.getMonth()+1;
      var mois1=mois;
      if(mois<10)
      {
      mois1='0'+mois
      }
     
      var jour=date1.getDate();
      if(jour<10)
      {
        jour='0'+jour;
      }
     
      var dateSQL = date1.getFullYear()+"/"+mois1+"/"+jour;
     
    
      
      return dateSQL;
     
 
  }

  function totalHT(event)
  {
    let sommeHT=0;
    let sommeTVA=0;
    if(event)
    {
    event.forEach(elt => {
     sommeHT=sommeHT +  elt.pu*elt.nbre_jours;
   });
   return sommeHT;
  } 
   
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function numberWithoutCommas(x) {
    return x.toString().replace(',', '');
  }

  function changedemandeur(item,pers)
  {
    
   
    pers.forEach(ac=> {
      if(ac.id==item.id_demandeur) {
          
           // item.mandatement_id = ac.id; 
           
            item.nompersonnel=ac.nom;
            console.log("tafiditra manolo");
         }
     });
   
  }
@Component({
  selector: 'app-demandedeb',
  templateUrl: './demande_debours.component.html',
  styleUrls: ['./demande_debours.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Demande_deboursComponent implements OnInit {

  NouvelItem  : boolean;
  NouvelItem_mission  : boolean;
  NouvelItem_prevhn  : boolean;
  NouvelItem_prevdeb  : boolean;
  NouvelItem_prevsec  : boolean;
    currentItem : any;
    selectedItem: any;
    selectedItem_c: any;
    selectedItem_mission: any;
    selectedItem_ph: any;
    selectedItem_detdeb: any;
    selectedItem_demande: any;
    selectedItem_debours:any;

    //@ViewChild(DataTableDirective, {static: false})
    //datatableElement: DataTableDirective;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;
    @ViewChild('filter', {static: true})
    filter: ElementRef;
        
    deboursForm:   FormGroup;
    deboursForm2:   FormGroup;
    clientForm:   FormGroup;
    honoraireForm:   FormGroup;
    debours :      any;
    produit :      any;
    nomclient:any;
    numcontrat:any;
    honoraire:any;
    prevdebours:any;
    idcontrat:any;
    idmission:any;
    idclient:any;
    somme:any;
    chk:MatCheckbox;
    

    step1:  boolean;
    step2:  boolean;

    afficherFormAjoutModif : Boolean;
    afficherboutonModifSupr: Boolean;
    afficherFormproduit : Boolean;
    afficherboutonproduit: Boolean;
    afficherboutonhonoraire: Boolean;
    afficherboutonprevdeb: Boolean;
    editprevhn:Boolean;
    editprevdeb:Boolean;

    loadingIndicator: boolean;
    reorderable:      boolean;
    row_demande:      any[];
    rows_actuel:      any[];
    row_prd:      any[];
    rows_debours:      any[];
    row_detdeb:      any[];
    row_prevdeb:      any[];
    row_debours_prec:any;
    row_prevsec:      any[];
    rows_prdactuel:      any[];
    row_client:      any[];
    row_honoraire_prec:any;
    rows_monnaie:      any[];
    row_personnel:      any[];
    row_produit:      any[];
    rows_grade:      any[];
    rows_pers:      any[];
    rows_region:      any[];
    selected = [];
    selected_c = [];
    selected_m = [];
    selected_detdem = [];
    selected_demande = [];
    selected_psec = [];
    temp=[];
    isChecked = false;

    columns_c = [
      { name: 'Code', prop: 'code' }, 
      { name: 'Nom client',   prop: 'nom_client', sortable: true } 
      
      ];

    columns = [
      { name: 'Code', prop: 'num_contrat' }, 
      { name: 'Date_contrat',   prop: 'date_contrat', sortable: true } 
      
      ];

      columns_m = [
        { name: 'Code', prop: 'num_contrat' }, 
        { name: 'Libelle',   prop: 'libelle', sortable: true } 
        
        ];

      columns_demande = [
        { name: 'libelle', prop: 'libelle' }, 
        { name: 'nom_client', prop: 'nom_client' }, 
        { name: 'num_demande', prop: 'num_demandee' }, 
        { name: 'date_demande',   prop: 'date_demande', sortable: true }, 
        { name: 'id_mission',   prop: 'id_mission', sortable: true }, 
        { name: 'id_demandeur',   prop: 'id_demandeur', sortable: true },
       
        
        ];
        columns_detdeb = [
          { name: 'Debours', prop: 'id_debours' }, 
          { name: 'id_pers',   prop: 'id_pers', sortable: true }, 
          { name: 'id_region',   prop: 'id_region', sortable: true }, 
          { name: 'localite',   prop: 'localite', sortable: true }, 
          { name: 'nbre_jours',   prop: 'nbre_jours', sortable: true }, 
          { name: 'nbre_heure',   prop: 'nbre_heure', sortable: true }, 
          { name: 'pu',   prop: 'pu', sortable: true }, 
          { name: 'montant',   prop: 'montant', sortable: true }, 
          { name: 'date debut',   prop: 'date_debut', sortable: true }, 
          { name: 'date fin',   prop: 'date_fin', sortable: true }, 
         
          ];

          columns_sec = [
            { name: 'grand_tache', prop: 'grand_tache' }, 
            { name: 'nbre_heure',   prop: 'nbre_heure', sortable: true }, 
          
           
            ];

  constructor(private _formBuilder: FormBuilder,private index_api: IndexApiService,public dialog: MatDialog)
  {
    // Set the private defaults

    //this.reorderable      = true;
   // this.loadingIndicator = true;
  //  this._unsubscribeAll  = new Subject(); 

    

     
    
  }

  @ViewChild('suppressionDialog', { static: true }) suppressionDialog:TemplateRef<any>;
  @ViewChild('suppressionDialog1', { static: true }) suppressionDialog1:TemplateRef<any>;
  @ViewChild('suppressionDialoghn', { static: true }) suppressionDialoghn:TemplateRef<any>;
  @ViewChild('suppressionDialogdeb', { static: true }) suppressionDialogdeb:TemplateRef<any>;
  @ViewChild('ajoutmodifDialog', { static: true }) ajoutmodifDialog:TemplateRef<any>;
  @ViewChild('saisieDialog', { static: true }) saisieDialog:TemplateRef<any>;
  @ViewChild('missionDialog', { static: true }) missionDialog:TemplateRef<any>;
  @ViewChild('honoraireDialog', { static: true }) honoraireDialog:TemplateRef<any>;
    
  ngOnInit(): void {
    
    
    this.NouvelItem = false;
    this.afficherFormAjoutModif  = false;
    this.afficherboutonModifSupr = false;
    this.step1  = false;
    this.step2  = false;
    this.temp = [];
    this.produit     = {}
      


    this.deboursForm = this._formBuilder.group(
    {
      id        : [''],
      num_contrat      : ['', Validators.required],
      date_contrat: ['', Validators.required],
      montant_ht: ['',''],
      monnaie: ['', ''],
      
      
    });

    this.clientForm = this._formBuilder.group(
      {
        id        : [''],
       nom_client: ['', Validators.required],
        
       
      });

      this.honoraireForm = this._formBuilder.group(
        {
         id        : [''],
         nbre_jour: ['', Validators.required],
         nbre_heure: ['', Validators.required],
         nbre_homme: ['', Validators.required],
         pu: ['', Validators.required],
         grade: ['', Validators.required],
         
        });

    this.deboursForm2 = this._formBuilder.group(
      {
        id        : [''],
        num_demande      : ['', Validators.required],
        id_demandeur: ['', Validators.required],
        date_demande: ['', Validators.required],
        nom_client:['',''],
        libelle:['',''],
     
       
       
      });
        
    
     /* this.index_api.getAllByClient('contrat',1).subscribe((response) =>
      {      
        this.row_demande = response['response'];
        this.rows_actuel=this.row_demande;
        
        console.log("tafiditra liste contrat");
        console.log(this.row_demande);
       // this.DataSource=response['response'];
       
        this.loadingIndicator = false;
      });*/
   

  
   

    this.index_api.getAll('client').subscribe((response) =>
    {      
      this.row_client = response['response'];
          
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    console.log("liste client");
    console.log(this.row_client);

    this.index_api.getAll('personnel').subscribe((response) =>
    {      
      this.row_personnel = response['response'];
          
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    

    this.index_api.getAll('produit').subscribe((response) =>
    {      
      this.row_produit = response['response'];
          
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    this.index_api.getAll('monnaie').subscribe((response) =>
    {      
      this.rows_monnaie = response['response'];
          
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    this.index_api.getAll('debours').subscribe((response) =>
    {      
      this.rows_debours = response['response'];
          
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    this.index_api.getAll('personnel').subscribe((response) =>
    {      
      this.rows_pers = response['response'];
    
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    this.index_api.getAll('region').subscribe((response) =>
    {      
      this.rows_region = response['response'];
      console.log("region");
      console.log(this.rows_region);
    
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });
      
      
  }

 

  changemonnaie(event)
  {
    
    console.log(event.value);
    //if(event)
   // this.lib=event.value;
  }

  onSelectClient(event)
  {
    
   console.log("Selectionne client");
    
    this.selected   = [];
    this.selected_m   = [];
    this.selected_detdem   = []
    this.afficherboutonModifSupr = false;
   
  if(!this.selectedItem_c)
  {
    this.index_api.getAllByClient('mission',parseInt(this.selected_c[0].id),'client').subscribe((response) =>
    {      
      this.row_prd = response['response'];
      this.row_prd=[...this.row_prd];
     
     
      this.row_detdeb=null;
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });
  }
  else
  {
    if(this.selectedItem_c.id!=this.selected_c[0].id)
    {
      this.index_api.getAllByClient('mission',parseInt(this.selected_c[0].id),'client').subscribe((response) =>
    {      
      this.row_prd = response['response'];
      this.row_prd=[...this.row_prd];
     
     
      this.row_detdeb=null;
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });
    }
  }
    if(event.selected)
    {
      this.selectedItem_c = event.selected[0];
    }
    
    this.idclient= this.selectedItem_c.id;
    this.nomclient=this.selectedItem_c.nom_client;
    
  
  }


 

  changetab(event)
  {
    
    
    console.log(event.index);
    if(event.index==0) 
    this.row_client=[...this.row_client];
    if(event.index==1 && this.row_prd!=null) 
    this.row_prd=[...this.row_prd];
    if(event.index==2 && this.row_demande!=null)
    this.row_demande=[...this.row_demande];
   

   
    
  
  }
  changetab1(event)
  {
    
    
    console.log(event.index);
    if(event.index==0) 
    {
      if(this.row_detdeb)
    this.row_detdeb=[...this.row_detdeb];
    }
    if(event.index==1) 
    {
      if(this.row_prevdeb)
    this.row_prevdeb=[...this.row_prevdeb];
    }
    if(event.index==2)
    { 
      if(this.row_prevsec)
    this.row_prevsec=[...this.row_prevsec];
    }

   
    
  
  }
  
   ajouter()
  {
    //this.afficherFormAjoutModif   = true;
    this.afficherboutonModifSupr  = false;
    this.NouvelItem = true;
    this.debours     = {}
    this.debours = 
    {
      id        : 0,
      num_contrat      : null,
      date_contrat: null,
      montant_ht: null,
      monnaie: null
      
      
     
    }
   
   

    this.dialog.open(this.saisieDialog, { disableClose: true });

   // this.afficherFormAjoutModif = true;
    //this.NouvelItem = false;
   
  }

  ajouter_produit()
  {
    this.afficherFormAjoutModif   = false;
    this.afficherFormproduit   = true;
    this.afficherboutonModifSupr  = false;
    this.NouvelItem_mission = true;
    this.produit     = {}
  
    this.produit = 
    {
      id        : null,
      date_demande      : null,
      id_demandeur: null,
      id_mision:this.selectedItem_mission.id,
      libelle:this.selectedItem_mission.libelle,
      nom_client:this.selectedItem_c.nom_client,
    
     
    }
    this.dialog.open(this.missionDialog, { disableClose: true });
   
  }
ajouter_honoraire()
{
  this.NouvelItem_prevhn=true;
 
    this.honoraire = 
    {
      id        : 0,
      nbre_jour      : null,
      nbre_heure: 8,
      nbre_homme: null,
     // pu: this.selectedItem_detdeb.pu,
      pu: null,
      grade: null,
     edit:true,
         
      
     
    }
    this.selected_detdem=[];
    this.selected_detdem[0]=this.honoraire;
    this.selectedItem_detdeb=this.honoraire;
    this.editprevhn=true;
  this.row_detdeb.unshift(this.honoraire); 
  this.row_detdeb  = [...this.row_detdeb]; 
  console.log("ajout2");
  console.log(this.NouvelItem);
  

}
test_honoraire=function(event) 
{
  if(event.id_pers>0 && event.nbre_jours>0  && event.pu>0) 
  {
    return false;
  }
  return true;
}
test_debours=function(event) 
{
  if(event.id_debours>0 && event.nbre_jours>0  && event.pu>0) 
  {
    return false;
  }
  return true;
}
annuler_honoraire()
{
  console.log("annuler");
  console.log(this.NouvelItem);
  if(this.NouvelItem==true)
  {
  this.row_detdeb.shift(); 
  this.row_detdeb  = [...this.row_detdeb];
   
  }
  else
  {
    this.selectedItem_detdeb.selected=false;
    this.selectedItem_detdeb.edit=false;  
    this.selectedItem_detdeb.nbre_jour=this.row_honoraire_prec.nbre_jour;
    this.selectedItem_detdeb.nbre_homme=this.row_honoraire_prec.nbre_homme;
    this.selectedItem_detdeb.nbre_heure=this.row_honoraire_prec.nbre_heure;
    this.selectedItem_detdeb.grade=this.row_honoraire_prec.grade;
    this.selectedItem_detdeb.libgrade=this.row_honoraire_prec.libgrade;

  }
  this.NouvelItem=false;
  this.editprevhn=false;

}

annuler_debours()
{
  console.log("annuler");
  console.log(this.NouvelItem);
  if(this.NouvelItem==true)
  {
  this.row_prevdeb.shift(); 
  this.row_prevdeb  = [...this.row_prevdeb];
   
  }
  else
  {
    this.selectedItem_debours.selected=false;
    this.selectedItem_debours.edit=false;  
    this.selectedItem_debours.nbre_jours=this.row_debours_prec.nbre_jours;
    this.selectedItem_debours.id_debours=this.row_debours_prec.id_debours;
    this.selectedItem_debours.libdebours=this.row_debours_prec.libdebours;

  }
  this.NouvelItem=false;
  this.editprevdeb=false;

}




  updateFilter(event) {
    
    const val = event.target.value.toLowerCase();
   
    this.row_demande=this.rows_actuel;
   
    let keys = Object.keys(this.row_demande[0]);
    let colsAmt = this.columns.length;
   
    this.row_demande =this.row_demande.filter(function(obj) {
      
      if(val)
      {
       //return obj.libelle.toLowerCase().indexOf(val)!==-1 || !val;
      
      for (let i=0; i<colsAmt; i++){

        // check for a match
  
        if (obj[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val){
  
          // found match, return true to add to result set
  
          return true;
  
        }
  
      }
     
      }
      else
       return obj[keys[0]].toString().substring(0,1)!=='';
    }); 

   
  }

   modifier()
  {
    this.debours = 
    {
      id        : this.selectedItem.id,
      num_contrat      : this.selectedItem.num_contrat,
      date_contrat: new Date(this.selectedItem.date_contrat),
      montant_ht: this.selectedItem.montant_ht,
      monnaie: this.selectedItem.monnaie
      
      
     
    }
   
    //this.selectedItem.date_contrat = this.datePipe.transform(this.selectedItem.date_contrat, 'dd-MM-yyyy');
    console.log("Contrat");
    console.log(this.selectedItem.date_contrat);

    this.dialog.open(this.saisieDialog, { disableClose: true });

   // this.afficherFormAjoutModif = true;
    this.NouvelItem = false;
  }

  modifier_produit()
  {
    this.produit = 
    {
      id        : this.selectedItem_demande.id,
      num_demande      : this.selectedItem_demande.num_demande,
      date_demande: this.selectedItem_demande.date_demande,
      id_mission: this.selectedItem_demande.id_mission,
      id_demandeur: this.selectedItem_demande.id_demandeur,
      libelle:this.selectedItem_demande.libelle,
      nom_client:this.selectedItem_demande.nom_client,
      
     
    }
   

    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
    this.NouvelItem_mission = false;
    this.dialog.open(this.missionDialog, { disableClose: true });
  }

  modifier_honoraire()
  {
    this.NouvelItem_prevhn=false;
    this.honoraire = 
    {
      id        : this.selectedItem_detdeb.id,
      nbre_jours      : this.selectedItem_detdeb.nbre_jours,
      nbre_heure: this.selectedItem_detdeb.nbre_heure,
      date_debut:new Date(this.selectedItem_detdeb.date_debut),
     // nbre_homme: this.selectedItem_detdeb.nbre_homme,
     // pu: this.selectedItem_detdeb.pu,
      pu: this.selectedItem_detdeb.pu,
      id_pers: this.selectedItem_detdeb.id_pers,
     //libgrade: this.selectedItem_detdeb.libgrade,
     
      
      
     
    }
   
    //this.selected_detdem[0].date_debut=formatD(this.selected_detdem[0].date_debut);
    //this.selected_detdem[0].date_debut=new Date('2021/09/03');
 //   this.selectedItem_detdeb.nbre_jours=Number(this.selectedItem_detdeb.nbre_jours);
    console.log("date debut modif");
    console.log(formatD(new Date(this.selected_detdem[0].date_debut)));
    this.row_honoraire_prec= this.honoraire;
    this.selectedItem_detdeb.edit=true;
    this.editprevhn=true;
    console.log(numberWithCommas(this.selectedItem_detdeb.pu));
    console.log(numberWithoutCommas((numberWithCommas(this.selectedItem_detdeb.pu))));
    this.afficherboutonhonoraire=true;
    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
   
    //this.dialog.open(this.honoraireDialog, { disableClose: true });
    console.log("edit honoraire");
    console.log(this.selectedItem_detdeb);
    console.log(this.NouvelItem_prevhn);
  }

 


   supprimer()
  {
    console.log('type');
    this.afficherFormAjoutModif = false;
    this.dialog.open(this.suppressionDialog1, { disableClose: true });
  }
  supprimer_produit()
  {
    this.afficherFormproduit = false;
    this.NouvelItem_mission=false;
   this.dialog.open(this.suppressionDialog, { disableClose: true });
  }
  supprimer_honoraire()
  {
    this.NouvelItem_prevhn=false;
    this.afficherFormproduit = false;
    this.dialog.open(this.suppressionDialoghn, { disableClose: true });
  }
  supprimer_debours()
  {
    this.afficherFormproduit = false;
    this.dialog.open(this.suppressionDialogdeb, { disableClose: true });
  }
  
  suppressionConfirmer()
  {
    this.ajout( this.selectedItem,1);
  } 

  suppressionConfirmer_produit()
  {
    this.ajout_produit( this.selectedItem_demande,1);
  } 
  suppressionConfirmer_honoraire()
  {
    this.ajout_honoraire( this.selectedItem_detdeb,1);
  } 
 
 
 

  annuler()
  {
    this.afficherFormAjoutModif = false;
    this.dialog.closeAll();
  }
  annuler_produit()
  {
    this.afficherFormproduit = false;
    this.dialog.closeAll();
  }
  annulermodal()
  {
    this.dialog.closeAll();
  }

  ajout( client,suppression)   
  {
      if (this.NouvelItem==false) 
      {
         // this.test_existance (client,suppression);
         console.log("manova io");
         this.insert_in_base(client,suppression);          
      }
      else
      {
          this.insert_in_base(client,suppression);
      }    
  }

  ajout_produit( client,suppression)   
  {
    this.afficherFormproduit = true;
      if (this.NouvelItem==false) 
      {
         // this.test_existance (client,suppression);
         console.log("manova io");
         this.insert_in_base_produit(client,suppression);          
      }
      else
      {
          this.insert_in_base_produit(client,suppression);
      }    
  }

  ajout_honoraire( client,suppression)   
  {
    this.afficherFormproduit = true;
      if (this.NouvelItem==false) 
      {
         // this.test_existance (client,suppression);
         console.log("manova io");
         this.insert_in_base_detail(client,suppression);          
      }
      else
      {
          this.insert_in_base_detail(client,suppression);
      }    
  }

  ajout_prevdebours( client,suppression)   
  {
    this.afficherFormproduit = true;
      if (this.NouvelItem==false) 
      {
         // this.test_existance (client,suppression);
         console.log("manova io");
         this.insert_in_base_prevdebours(client,suppression);          
      }
      else
      {
          this.insert_in_base_prevdebours(client,suppression);
      }    
  }

 //Andrana mise a jour smartgit
  sauver_honoraire()
  {
    console.log("Sauver honoraire");
    console.log(this.selectedItem_detdeb);
    this.selectedItem_detdeb.edit=false;
    this.editprevhn=false;
    this.somme=totalHT(this.row_detdeb);
  }
  changejour(event)
  {
    console.log("manolo nombre jour");
    this.somme=totalHT(this.row_detdeb);
    //event.date_fin=new Date(event.date_debut + 4);
    let date1 = new Date(event.date_debut); 
    let nbjour=event.nbre_jours;
    let date2 =date1.getTime() + (60*60*24)*1000*(nbjour-1); 
    let date3=new Date(date2);
    console.log(formatD(date3));
    event.date_fin=formatD(date3);
  }

  changeregion = function (item) {
    
    this.rows_region.forEach(ac=> {
     if(ac.id==item.id_region) {
         
          // item.mandatement_id = ac.id; 
          
           item.nomregion=ac.libelle;
           console.log("tafiditra manolo");
        }
    });
  } 

 // row_detdeb.forEach(elt => {
  changepers = function (item) {
    console.log("manolo personnel");
    this.rows_pers.forEach(ac=> {
     if(ac.id==item.id_pers) {
         
          // item.mandatement_id = ac.id; 
          
           item.nompersonnel=ac.nom;
           console.log("tafiditra manolo personnel");
        }
    });
  } 

  changedebours = function (item) {
    console.log("manolo debours 1");
    this.rows_debours.forEach(ac=> {
     if(ac.id==item.id_debours) {
         
          // item.mandatement_id = ac.id; 
           item.libdebours=ac.libelle;
           item.libdebours=ac.libelle;
           console.log("tafiditra manolo debours");
        }
    });
  } 

  insert_in_base = function (debours, suppression)
  {    
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem==false) 
    {
      console.log("maka id");
        getId = this.selectedItem.id; 
        
        lib=debours.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        num_contrat      :debours.num_contrat,
        date_contrat:debours.date_contrat,
        monnaie:debours.monnaie,
        montant_ht:debours.montant_ht,
        id_client:this.idclient,
        
        
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('Contrat',insert_data , config).subscribe((response) =>
      {
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              
              this.selectedItem.date_contrat  = formatD(debours.date_contrat);
              this.selectedItem.num_contrat        = debours.num_contrat;
              this.selectedItem.monnaie        = debours.monnaie;
              this.selectedItem.montant_ht        = debours.montant_ht;
              
            
            
            
            } 
            else 
            {    
              this.row_demande = this.row_demande.filter((obj)=>
              {                
                return obj.id !== this.currentItem.id;
              });
              this.row_demande  = [...this.row_demande];
              this.selected     = [];
              this.afficherboutonModifSupr = false;
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        date_contrat: formatD(debours.date_contrat),
                        num_contrat      : debours.num_contrat,
                        monnaie:debours.monnaie,
                        montant_ht:debours.montant_ht,

                        
                      
                       
                    };
            this.row_demande.unshift(item); 
            this.row_demande  = [...this.row_demande];                   
            this.NouvelItem   = false;
          }
          this.afficherFormAjoutModif = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur");
        this.dialog.closeAll();
      });
      
  }


  insert_in_base_produit = function (produit, suppression)
  {    
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem_mission==false) 
    {
      console.log("maka id");
        getId = this.selectedItem_demande.id; 
        
      
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        num_demande      :produit.num_demande,
        date_demande:produit.date_demande,
        id_mission: this.selectedItem_mission.id,
        id_demandeur:produit.id_demandeur,
       

       
      }

      let insert_data = this.serializeData(data);
     
      
      this.index_api.add('demandedebours',insert_data , config).subscribe((response) =>
      {
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem_mission == false) 
        {
          console.log("tafiditra manova demande");
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log('manova mission');
              
              this.selectedItem_demande.num_demande  = produit.num_demande;
              this.selectedItem_demande.date_demande        = formatD(produit.date_demande);
              this.selectedItem_demande.id_demandeur        = produit.id_demandeur;
              this.selectedItem_demande.id_mission        = produit.id_mission;  
              changedemandeur(this.selectedItem_demande,this.rows_pers);
              
            
            } 
            else 
            {    
              console.log("mamono demande");
              this.row_demande = this.row_demande.filter((obj)=>
              {                
                return obj.id !== this.selectedItem_demande.id;
              });
              this.row_demande  = [...this.row_demande];
              //this.selected_m     = [];
              this.afficherboutonproduit = false;
            }
          }
          else
          {
            console.log("mampiditra demande");
            let item = {
                        id        :String(response.response) ,
                        num_demande: produit.num_demande,
                        id_mission: this.selectedItem_mission.id,
                        date_demande:formatD(produit.date_demande),
                        id_demandeur:produit.id_demandeur,
                        nom_client:this.selectedItem_c.nom_client.nom_client,
                        libelle:this.selectedItem_mission.libelle,

                       
                    };
                    
            this.row_demande.unshift(item); 
            this.row_demande  = [...this.row_demande];
            this.selected_demande[0]=item;
            this.selectedItem_demande=this.selected_demande[0];
            this.selectedItem_demande.id=item.id;
            this.selectedItem_demande.nom_client=produit.nom_client;
           // item.selected=true; 
            changedemandeur(this.selectedItem_demande,this.rows_pers); 
            console.log("item");
            console.log(item);                 
            this.NouvelItem_mission   = false;
          }
          this.afficherFormproduit = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur");
        this.dialog.closeAll();
      });
      
  }


  insert_in_base_detail = function (produit, suppression)
  {    
    produit=this.selected_detdem[0];
   
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem_prevhn==false) 
    {
      console.log("maka id");
        getId = this.selectedItem_detdeb.id; 
        
        //lib=produit.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        nbre_jours      :produit.nbre_jours,
        date_debut:produit.date_debut,
        date_fin:produit.date_fin,
        pu: numberWithoutCommas(produit.pu),
        id_demande:this.selectedItem_demande.id,
        id_debours:produit.id_debours,
        id_pers:produit.id_pers,
        id_region:produit.id_region,

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('detaildebours',insert_data , config).subscribe((response) =>
      {
        console.log('manova detail 1');
        console.log(this.NouvelItem_prevhn);
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem_prevhn == false) 
        {
          console.log('manova detail 2');
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log("manova detail");

              
              this.selectedItem_detdeb.grade  = produit.grade;
              this.selectedItem_detdeb.nbre_jour        = produit.nbre_jour;
              this.selectedItem_detdeb.nbre_homme        = produit.nbre_homme;
              this.selectedItem_detdeb.nbre_heure        = produit.nbre_heure;  
              this.selectedItem_detdeb.pu        = numberWithoutCommas(produit.pu);  
              this.selectedItem_detdeb.id_mission        = this.idmission;    
            
              this.editprevhn=false;
              this.selectedItem_detdeb.edit=false;
              this.somme=totalHT(this.row_detdeb);
            
            } 
            else 
            {    
              this.row_detdeb = this.row_detdeb.filter((obj)=>
              {                
                return obj.id !==  this.selectedItem_detdeb.id;
              });
              this.row_detdeb  = [...this.row_detdeb];
              this.selected_prevhn     = [];
              this.afficherboutonproduit = false;
              this.somme=totalHT(this.row_detdeb);
            }
          }
          else
          {
            console.log("manampy detail");
            let item = {
                        id        :String(response.response) ,
                        nbre_jour      :produit.nbre_jour,
                        nbre_homme:produit.nbre_homme,
                        nbre_heure:produit.nbre_heure,
                        grade:produit.grade,
                        pu:produit.pu,
                        id_mission:this.idmission,
                        edit:false,

                       
                    };
                    this.selectedItem_detdeb.id=item.id;
          //  this.row_detdeb.unshift(item); 
          //  this.row_detdeb  = [...this.row_detdeb];                   
          this.NouvelItem_prevhn   = false;
            this.editprevhn=false;
            this.selectedItem_detdeb.edit=false;
            this.somme=totalHT(this.row_detdeb);
          }
          this.afficherFormproduit = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur honoraire");
        this.dialog.closeAll();
      });
      
  }

  insert_in_base_prevdebours = function (produit, suppression)
  {    
    produit=this.selected_pdeb[0];
   
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem==false) 
    {
      console.log("maka id");
        getId = this.selectedItem_pdeb.id; 
        
        //lib=produit.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        nbre_jours      :produit.nbre_jours,
        id_debours:produit.id_debours,
        pu: numberWithoutCommas(produit.pu),
        id_mission:this.idmission

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('prevdebours',insert_data , config).subscribe((response) =>
      {
        console.log('manova prev debours');
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log('manova prev debours');
              
              this.selectedItem_pdeb.id_debours  = produit.id_debours;
              this.selectedItem_pdeb.nbre_jours        = produit.nbre_jours;
              this.selectedItem_pdeb.pu        = numberWithoutCommas(produit.pu);  
              this.selectedItem_pdeb.id_mission        = this.idmission;    
            
              this.editprevdeb=false;
              this.selectedItem_pdeb.edit=false;
            
            } 
            else 
            {    
              this.row_prevdeb = this.row_prevdeb.filter((obj)=>
              {                
                return obj.id !==  this.selectedItem_pdeb.id;
              });
              this.row_prevdeb  = [...this.row_prevdeb];
              this.selected_prevdeb     = [];
              
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        nbre_jours      :produit.nbre_jours,
                        id_debours:produit.id_debours,
                        pu:produit.pu,
                        id_mission:this.idmission,
                        edit:false,

                       
                    };
          //  this.row_detdeb.unshift(item); 
            this.row_detdeb  = [...this.row_detdeb];  
            this.selectedItem_pdeb.id=item.id;                 
            this.NouvelItem   = false;
            this.editprevdeb=false;
            this.selectedItem_pdeb.edit=false;
            
          }
          this.afficherFormproduit = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur debours");
        this.dialog.closeAll();
      });
      
  }




   onSelectdebours(event)
  {  
    this.selectedItem = event.selected[0];
    this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));
    this.selected_m   = [];
    
    console.log("selectionne");
    console.log(this.selectedItem);

    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    this.afficherboutonproduit=false;
    this.afficherFormproduit=false;
    this.idcontrat=this.selectedItem.id;
    this.numcontrat=this.selectedItem.num_contrat;
    
//Filtrer le produit
this.row_prd=this.selectedItem.mission;




//Fin filtrer


      
  }

  onSelectmission(event)
  {  

   
    this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));

   

    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    
    this.afficherFormproduit=false;
    this.afficherboutonhonoraire=false;
    this.editprevhn=false;
   
   // let id_type=this.selectedItem.id;
   console.log('afficher mission');
  console.log(this.selectedItem_mission);

  this.idmission=this.selected_m[0].id;
if(!this.selectedItem_mission)
{
  console.log("vide selectionne");
   this.index_api.getAllByClient('demandedebours',parseInt(this.selected_m[0].id),'mission').subscribe((response) =>
    {      
      this.row_demande = [...response['response']];
     
         
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
      this.somme=totalHT(this.row_detdeb);
     

      this.selected_detdem   = [];
      this.row_detdeb=[];

    });
  }
  else
  {
    if(this.selectedItem_mission.id!=this.selected_m[0].id)
    {
      this.index_api.getAllByClient('demandedebours',parseInt(this.selected_m[0].id),'mission').subscribe((response) =>
    {      
      this.row_demande = [...response['response']];
     
         
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
      this.somme=totalHT(this.row_detdeb);
     

      this.selected_detdem   = [];
      this.row_detdeb=[];

    });
    }
  }
 
    if(event.selected)  
    {
      this.selectedItem_mission = event.selected[0];
    }  
   


      
  }
  
  onSelectdemande(event)
  {  
    if(this.selectedItem_demande)
    {
      

      if(this.selectedItem_demande.id!=this.selected_demande[0].id)
      {
        
        this.selectedItem_demande.edit=false;
        this.editprevdeb=false;
        if(this.selectedItem_demande.id==0)
        {
        //  this.row_prevdeb.shift(); 
        //  this.row_prevdeb  = [...this.row_prevdeb];
        } 
      }
      
    }

    this.index_api.getAllByClient('detaildebours',parseInt(this.selected_demande[0].id),'client').subscribe((response) =>
    {      
      this.row_detdeb = response['response'];
      this.row_detdeb=[...this.row_detdeb];
      
      console.log("tafiditra liste detail debours");
      console.log(this.row_detdeb);
     
    // this.DataSource=response['response'];
    
      this.loadingIndicator = false;
      this.somme=totalHT(this.row_detdeb);
    });


    if(event.selected )
    {
      this.selectedItem_demande = event.selected[0];
    }
   // this.afficherboutonhonoraire = true;
    this.afficherboutonprevdeb=true;
   console.log("debours selectionne");
   console.log(this.selectedItem_demande);
   this.afficherboutonproduit=true;
          
  }
  onSelectdetdemande(event)
  {  
    if(this.selectedItem_detdeb)
    {
      

      if(this.selectedItem_detdeb.id!=this.selected_detdem[0].id)
      {console.log("tsy mitovy");
      this.selectedItem_detdeb.edit=false;
      this.editprevhn=false;
      if(this.selectedItem_detdeb.id==0)
      {
        this.row_detdeb.shift(); 
        this.row_detdeb  = [...this.row_detdeb];
      } 
      }
      
    }
    if(event.selected )
    {
     this.selectedItem_detdeb = event.selected[0];
    }
    this.afficherboutonhonoraire = true;
   
   
   

          
  }

 
 
 
 onActivate(event)
 { 
    if (event.type === 'dblclick')
    {
      let deb = 
      {
        id        : event.row.id,
        code      : event.row.code,
        libelle   : event.row.libelle
        
       
       
      }
     
      this.dialog.open(this.ajoutmodifDialog, { disableClose: true,data: deb });
    }
  }

 //serialized mitovy @ $.param()
   private serializeData( data )
   {     
        var buffer = [];    
        // Serialize each key in the object.
        for ( var name in data )
        { 
            if ( ! data.hasOwnProperty( name ))
            { 
                continue; 
            }
    
            var value = data[ name ];    
            buffer.push( encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )); 
        }
    
        // Serialize the buffer and clean it up for transportation.
        var source = buffer.join( "&" ).replace( /%20/g, "+" ); 
        return( source ); 
    }

    

 

}