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
     sommeHT=sommeHT +  elt.pu*elt.nbre_homme*elt.nbre_jour;
   });
   return sommeHT;
  } 
   
  }

  function totalDeb(event)
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

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MissionComponent implements OnInit {

  NouvelItem  : boolean;
  NouvelItem_mission  : boolean;
  NouvelItem_prevhn  : boolean;
  NouvelItem_prevdeb  : boolean;
  NouvelItem_prevsec  : boolean;
  NouvelItem_ech  : boolean;
  NouvelItem_sec:boolean;
    currentItem : any;
    selectedItem: any;
    selectedItem_c: any;
    selectedItem_mission: any;
    selectedItem_ph: any;
    selectedItem_honoraire: any;
    selectedItem_pdeb: any;
    selectedItem_debours:any;
    selectedItem_ech:any;
    selectedItem_sec:any;

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
    section:any;
    echeance:any;
    prevdebours:any;
    idcontrat:any;
    idmission:any;
    idclient:any;
    somme:any;
    sommedeb:any;
    chk:MatCheckbox;
    

    step1:  boolean;
    step2:  boolean;

    afficherFormAjoutModif : Boolean;
    afficherboutonModifSupr: Boolean;
    afficherFormproduit : Boolean;
    afficherboutonproduit: Boolean;
    afficherboutonhonoraire: Boolean;
    afficherboutonprevdeb: Boolean;
    afficherboutonech: Boolean;
    afficherboutonsec:Boolean;
    editprevhn:Boolean;
    editprevdeb:Boolean;
    editech:Boolean;
    editsec:Boolean;
    okchange:Boolean;

    loadingIndicator: boolean;
    reorderable:      boolean;
    row_type:      any[];
    rows_actuel:      any[];
    row_prd:      any[];
    rows_debours:      any[];
    row_prevhn:      any[];
    row_prevdeb:      any[];
    row_echeance:      any[];
    rows_section:any[];
    row_debours_prec:any;
    row_echeance_prec:any;
    row_section_prec:any;
    row_prevsec:      any[];
    rows_prdactuel:      any[];
    row_client:      any[];
    row_honoraire_prec:any;
    rows_monnaie:      any[];
    row_personnel:      any[];
    row_produit:      any[];
    rows_grade:      any[];
    selected = [];
    selected_c = [];
    selected_m = [];
    selected_phn = [];
    selected_pdeb = [];
    selected_pech = [];
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

      columns_hn = [
        { name: 'Grade', prop: 'grade' }, 
        { name: 'nbre_jour',   prop: 'nbre_jour', sortable: true }, 
        { name: 'nbre_homme',   prop: 'nbre_homme', sortable: true }, 
        { name: 'nbre_heure',   prop: 'nbre_heure', sortable: true },
        { name: 'Duree_totale',   prop: 'duree_totale', sortable: true }  
        
        ];
        columns_deb = [
          { name: 'Debours', prop: 'id_debours' }, 
          { name: 'nbre_jours',   prop: 'nbre_jours', sortable: true }, 
          { name: 'pu',   prop: 'pu', sortable: true }, 
         
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
      libelle      : ['', Validators.required],
      date_debut      : ['', Validators.required],
      date_fin      : ['', Validators.required],
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
        code      : ['', Validators.required],
        libelle: ['', Validators.required],
        associe_resp: ['', Validators.required],
        date_deb_prevue: ['', Validators.required],
        date_fin_prevue: ['', Validators.required],
        associate_director: ['', ''],
        director: ['', ''],
        senior_manager: ['', Validators.required],
        chef_mission: ['', Validators.required],
        produit: ['', Validators.required],
     
       
       
      });
        
    
     /* this.index_api.getAllByClient('contrat',1).subscribe((response) =>
      {      
        this.row_type = response['response'];
        this.rows_actuel=this.row_type;
        
        console.log("tafiditra liste contrat");
        console.log(this.row_type);
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

    this.index_api.getAll('Grade').subscribe((response) =>
    {      
      this.rows_grade = response['response'];
    
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    this.index_api.getAll('Section').subscribe((response) =>
    {      
      this.rows_section = response['response'];
    
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

  onSelectecheance(event)
  {
    if(this.selectedItem_ech)
    {
      

      if(this.selectedItem_ech.id!=this.selected_pech[0].id)
      {console.log("tsy mitovy");
      this.selectedItem_ech.edit=false;
      this.editech=false;
      if(this.selectedItem_ech.id==0)
      {
        this.row_echeance.shift(); 
        this.row_echeance  = [...this.row_prevhn];
      } 
      }
      
    }
    if(event.selected )
    {
     this.selectedItem_ech = event.selected[0];
    }
   // this.afficherboutonhonoraire = true;
      
    this.afficherboutonech=true;
  }

  onSelectsection(event)
  {
    if(this.selectedItem_sec)
    {
      

      if(this.selectedItem_sec.id!=this.selected_psec[0].id)
      {console.log("tsy mitovy");
      this.selectedItem_sec.edit=false;
      this.editsec=false;
      if(this.selectedItem_sec.id==0)
      {
        this.row_prevsec.shift(); 
        this.row_prevsec  = [...this.row_prevsec];
      } 
      }
      
    }
    if(event.selected )
    {
     this.selectedItem_sec = event.selected[0];
    }
   // this.afficherboutonhonoraire = true;
      
    this.afficherboutonsec=true;
  }

  onSelectClient(event)
  {
    
    //console.log("miova index");
    
  //  this.selected_c   = [];
   // this.selected_m   = [];
   // this.selected_phn   = []
    this.afficherboutonModifSupr = false;
    this.okchange=false;
    
    
      if(!this.selectedItem_c)
      {
        this.index_api.getAllByClient('contrat',parseInt(this.selected_c[0].id),'client').subscribe((response) =>
        {      
          this.row_type = response['response'];
          this.row_type=[...this.row_type];
          
          console.log("tafiditra liste contrat nofidina");
          console.log(this.row_type);
          this.row_prd=null;
          this.row_prevhn=null;
        // this.DataSource=response['response'];
        
          this.loadingIndicator = false;
        });
      }
      else
      {
        if(this.selectedItem_c.id!=this.selected_c[0].id)
        {
        this.index_api.getAllByClient('contrat',parseInt(this.selected_c[0].id),'client').subscribe((response) =>
        {      
          this.row_type = response['response'];
          this.row_type=[...this.row_type];
          
          console.log("tafiditra liste contrat nofidina");
          console.log(this.row_type);
          this.row_prd=null;
          this.row_prevhn=null;
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
    this.okchange=false;
  
  }


 

  changetab(event)
  {
    
    
    console.log(event.index);
    if(event.index==0) 
    this.row_client=[...this.row_client];
    if(event.index==1 && this.row_type!=null) 
    this.row_type=[...this.row_type];
    if(event.index==2 && this.row_prd!=null)
    this.row_prd=[...this.row_prd];
   

   
    
  
  }
  changetab1(event)
  {
    
    
    console.log(event.index);
    if(event.index==0) 
    {
      if(this.row_prevhn)
    this.row_prevhn=[...this.row_prevhn];
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
    this.selected_m   = [];
    let deb = 
    {
      id        : null,
      code      : null,
      libelle: null,
      associe_resp:null,
      associate_director:null,
      director:null,
      date_deb_prevue:null,
      date_fin_prevue:null,
      senior_manager:null,
      chef_mission:null,
      produit:null
    
     
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
     // pu: this.selectedItem_honoraire.pu,
      pu: null,
      grade: null,
     edit:true,
         
      
     
    }
    this.selected_phn=[];
    this.selected_phn[0]=this.honoraire;
    this.selectedItem_honoraire=this.honoraire;
    this.editprevhn=true;
  this.row_prevhn.unshift(this.honoraire); 
  this.row_prevhn  = [...this.row_prevhn]; 
  console.log("ajout2");
  console.log(this.NouvelItem);
  

}
test_honoraire=function(event) 
{
  if(event.grade>0 && event.nbre_jour>0 && event.nbre_homme>0 && event.pu>0 && event.nbre_heure>0) 
  {
    return false;
  }
  return true;
}

test_section=function(event) 
{
  if(event.grand_tache.length>0  && event.nbre_heure>0) 
  {
    return false;
  }
  return true;
}
test_echeance=function(event) 
{
  if(event.nbre_jours>0 && event.libelle.length>0 && event.pourcentage>0 ) 
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
  if(this.NouvelItem_prevhn==true)
  {
  this.row_prevhn.shift(); 
  this.row_prevhn  = [...this.row_prevhn];
  this.somme=totalHT(this.row_prevhn);
   
  }
  else
  {
    this.selectedItem_honoraire.selected=false;
    this.selectedItem_honoraire.edit=false;  
    this.selectedItem_honoraire.nbre_jour=this.row_honoraire_prec.nbre_jour;
    this.selectedItem_honoraire.nbre_homme=this.row_honoraire_prec.nbre_homme;
    this.selectedItem_honoraire.nbre_heure=this.row_honoraire_prec.nbre_heure;
    this.selectedItem_honoraire.grade=this.row_honoraire_prec.grade;
    this.selectedItem_honoraire.libgrade=this.row_honoraire_prec.libgrade;

  }
  this.NouvelItem_prevhn=false;
  this.editprevhn=false;

}

annuler_echeance()
{
 
  if(this.NouvelItem_ech==true)
  {
  this.row_echeance.shift(); 
  this.row_echeance  = [...this.row_prevhn];
  
   
  }
  else
  {
    this.selectedItem_ech.selected=false;
    this.selectedItem_ech.edit=false;  
    this.selectedItem_ech.nbre_jours=this.row_echeance_prec.nbre_jours;
    this.selectedItem_ech.libelle=this.row_echeance_prec.libelle;
    this.selectedItem_ech.pourcentage=this.row_echeance_prec.pourcentage;
    this.selectedItem_ech.date_facture=this.row_echeance_prec.date_facture;
  

  }
  this.NouvelItem_ech=false;
  this.editech=false;

}

annuler_section()
{
 
  if(this.NouvelItem_sec==true)
  {
  this.row_prevsec.shift(); 
  this.row_prevsec  = [...this.row_prevsec];
  
   
  }
  else
  {
    this.selectedItem_sec.selected=false;
    this.selectedItem_sec.edit=false;  
    this.selectedItem_sec.grand_tache=this.row_section_prec.grand_tache;
    this.selectedItem_sec.nbre_heure=this.row_section_prec.nbre_heure;
   

  }
  this.NouvelItem_sec=false;
  this.editsec=false;

}

annuler_debours()
{
  console.log("annuler");
  console.log(this.NouvelItem);
  if(this.NouvelItem_prevdeb==true)
  {
  this.row_prevdeb.shift(); 
  this.row_prevdeb  = [...this.row_prevdeb];
  this.sommedeb=totalDeb(this.row_prevhn);
   
  }
  else
  {
    this.selectedItem_pdeb.selected=false;
    this.selectedItem_pdeb.edit=false;  
    this.selectedItem_pdeb.nbre_jours=this.row_debours_prec.nbre_jours;
    this.selectedItem_pdeb.id_debours=this.row_debours_prec.id_debours;
    this.selectedItem_pdeb.libdebours=this.row_debours_prec.libdebours;

  }
  this.NouvelItem_prevdeb=false;
  this.editprevdeb=false;

}

ajouter_echeance()
{
  this.NouvelItem_ech=true;
 
    this.echeance = 
    {
      id        : 0,
      nbre_jours      : null,
      libelle: null,
      date_facture: null,
      pourcentage:null,
     edit:true,
         
      
     
    }
    this.selected_pech=[];
    this.selected_pech[0]=this.echeance;
    this.selectedItem_ech=this.echeance;
    this.editech=true;
  this.row_echeance.unshift(this.echeance); 
  this.row_echeance  = [...this.row_echeance]; 
  console.log("ajout2");
  
  

}

ajouter_section()
{
  this.NouvelItem_sec=true;
 
    this.section = 
    {
      id        : 0,
      grand_tache      : null,
      nbre_heure: null,
      edit:true,
         
      
     
    }
    this.selected_psec=[];
    this.selected_psec[0]=this.section;
    this.selectedItem_sec=this.section;
    this.editech=true;
  this.row_prevsec.unshift(this.section); 
  this.row_prevsec  = [...this.row_prevsec]; 
  console.log("ajout2");
  
  

}

ajouter_debours()
{
  this.NouvelItem_prevdeb=true;
 
    this.prevdebours = 
    {
      id        : 0,
      nbre_jours      : null,
      pu: null,
      id_debours: null,
     edit:true,
         
      
     
    }
    this.selected_pdeb=[];
    this.selected_pdeb[0]=this.prevdebours;
    this.selectedItem_pdeb=this.prevdebours;
    this.editprevdeb=true;
  this.row_prevdeb.unshift(this.prevdebours); 
  this.row_prevdeb  = [...this.row_prevdeb]; 
  console.log("ajout2");
  console.log(this.NouvelItem);
  

}
  updateFilter(event) {
    
    const val = event.target.value.toLowerCase();
   
    this.row_type=this.rows_actuel;
   
    let keys = Object.keys(this.row_type[0]);
    let colsAmt = this.columns.length;
   
    this.row_type =this.row_type.filter(function(obj) {
      
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
      libelle      : this.selectedItem.libelle,
      date_contrat: new Date(this.selectedItem.date_contrat),
      date_debut: new Date(this.selectedItem.date_debut),
      date_fin: new Date(this.selectedItem.date_fin),
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
      id        : this.selectedItem_mission.id,
      code      : this.selectedItem_mission.code,
      libelle: this.selectedItem_mission.libelle,
      associe_resp: this.selectedItem_mission.associe_resp,
      associate_director: this.selectedItem_mission.associate_director,
      director: this.selectedItem_mission.director,
      date_deb_prevue: this.selectedItem_mission.date_deb_prevue,
      date_fin_prevue: this.selectedItem_mission.date_fin_prevue,
      senior_manager: this.selectedItem_mission.senior_manager,
      chef_mission: this.selectedItem_mission.chef_mission,
      produit:this.selectedItem_mission.produit,
      
      
     
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
      id        : this.selectedItem_honoraire.id,
      nbre_jour      : this.selectedItem_honoraire.nbre_jour,
      nbre_heure: this.selectedItem_honoraire.nbre_heure,
      nbre_homme: this.selectedItem_honoraire.nbre_homme,
     // pu: this.selectedItem_honoraire.pu,
      pu: this.selectedItem_honoraire.pu,
      grade: this.selectedItem_honoraire.grade,
      libgrade: this.selectedItem_honoraire.libgrade,
     
      
      
     
    }
   
    this.row_honoraire_prec= this.honoraire;
    this.selectedItem_honoraire.edit=true;
    this.editprevhn=true;
    console.log(numberWithCommas(this.selectedItem_honoraire.pu));
    console.log(numberWithoutCommas((numberWithCommas(this.selectedItem_honoraire.pu))));
    this.afficherboutonhonoraire=true;
    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
    this.NouvelItem = false;
    //this.dialog.open(this.honoraireDialog, { disableClose: true });
    console.log("edit honoraire");
    console.log(this.selectedItem_honoraire);
  }

  modifier_echeance()
  {
    this.NouvelItem_ech=false;
    this.echeance = 
    {
      id        : this.selectedItem_ech.id,
      nbre_jours      : this.selectedItem_ech.nbre_jours,
      pourcentage: this.selectedItem_ech.pourcentage,
      date_facture: this.selectedItem_ech.date_facture,
      id_mission: this.selectedItem_ech.id_mission,
      libelle: this.selectedItem_ech.libelle,
     
      
      
     
    }
   
    this.row_echeance_prec= this.echeance;
    this.selectedItem_ech.edit=true;
    this.editech=true;
    this.afficherboutonech=true;
    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
    this.NouvelItem_ech = false;
    //this.dialog.open(this.honoraireDialog, { disableClose: true });
    console.log("edit echeance");
    console.log(this.selectedItem_ech);
  }

  modifier_section()
  {
    this.NouvelItem_sec=false;
    this.section = 
    {
      id        : this.selectedItem_sec.id,
      id_mission: this.selectedItem_sec.id_mission,
      grand_tache: this.selectedItem_sec.grand_tache,
      nbre_heure: this.selectedItem_sec.nbre_heure,
          
    }
   
    this.row_section_prec= this.section;
    this.selectedItem_sec.edit=true;
    this.editsec=true;
    this.afficherboutonsec=true;
    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
    this.NouvelItem_sec = false;
    //this.dialog.open(this.honoraireDialog, { disableClose: true });
    console.log("edit echeance");
    console.log(this.selectedItem_sec);
  }



  modifier_debours()
  {
    this.NouvelItem_prevdeb=false;
    this.prevdebours = 
    {
      id        : this.selectedItem_pdeb.id,
      nbre_jours      : this.selectedItem_pdeb.nbre_jours,
      pu: this.selectedItem_pdeb.pu,
      id_debours: this.selectedItem_pdeb.id_debours,
      libdebours: this.selectedItem_pdeb.libdebours,
     
      
      
     
    }
   
    this.row_debours_prec= this.prevdebours;
    this.selectedItem_pdeb.edit=true;
    this.editprevdeb=true;
    this.afficherboutonprevdeb=true;
    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
    this.NouvelItem_prevdeb = false;
    //this.dialog.open(this.honoraireDialog, { disableClose: true });
    
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
    this.NouvelItem_prevdeb=false;
    this.afficherFormproduit = false;
    this.dialog.open(this.suppressionDialogdeb, { disableClose: true });
  }
  
  suppressionConfirmer()
  {
    this.ajout( this.selectedItem,1);
  } 

  suppressionConfirmer_produit()
  {
    this.ajout_produit( this.selectedItem,1);
  } 
  suppressionConfirmer_honoraire()
  {
    this.ajout_honoraire( this.selectedItem_honoraire,1);
  } 
 
  suppressionConfirmer_debours()
  {
    this.ajout_prevdebours( this.selectedItem_pdeb,1);
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
         this.insert_in_base_honoraire(client,suppression);          
      }
      else
      {
          this.insert_in_base_honoraire(client,suppression);
      }    
  }

  ajout_echeance( client,suppression)   
  {
    
      if (this.NouvelItem_ech==false) 
      {
         // this.test_existance (client,suppression);
         console.log("manova io");
         this.insert_in_base_echeance(client,suppression);          
      }
      else
      {
          this.insert_in_base_echeance(client,suppression);
      }    
  }

  ajout_section( client,suppression)   
  {
    
      if (this.NouvelItem_sec==false) 
      {
         // this.test_existance (client,suppression);
         console.log("manova io");
         this.insert_in_base_section(client,suppression);          
      }
      else
      {
          this.insert_in_base_section(client,suppression);
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


  sauver_honoraire()
  {
    console.log("Sauver honoraire");
    console.log(this.selectedItem_honoraire);
    this.selectedItem_honoraire.edit=false;
    this.editprevhn=false;
    this.somme=totalHT(this.row_prevhn);
  }
  changejour()
  {
    console.log("manolo nombre jour");
    this.somme=totalHT(this.row_prevhn);
  }
  changedeb()
  {
    console.log("manolo debours");
    this.sommedeb=totalDeb(this.row_prevdeb);
    console.log(this.sommedeb);
  }

 /* changegrade(event)
  {
    
    console.log(event.value);
    console.log(event);
   // this.selectedItem_honoraire.libgrade="Salut";
    //if(event)
   // this.lib=event.value;
  }*/

 // row_prevhn.forEach(elt => {

  changepers = function (item) {
    
    this.row_personnel.forEach(ac=> {
     if(ac.id==item.value) {
         
          // item.mandatement_id = ac.id; 
         //  item.nompersonnel=ac.nom;
           //this.selectedItem_honoraire.libgrade=ac.libelle;
           console.log("tafiditra manolo");
        }
    });
  } 

  changegrade = function (item) {
    
    this.rows_grade.forEach(ac=> {
     if(ac.id==item.value) {
         
          // item.mandatement_id = ac.id; 
           item.libgrade=ac.libelle;
           this.selectedItem_honoraire.libgrade=ac.libelle;
           console.log("tafiditra manolo");
        }
    });
  } 

  changedebours = function (item) {
    
    this.rows_debours.forEach(ac=> {
     if(ac.id==item.value) {
         
          // item.mandatement_id = ac.id; 
           item.libdebours=ac.libelle;
           this.selectedItem_pdeb.libdebours=ac.libelle;
           console.log("tafiditra manolo");
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
        libelle      :debours.libelle,
        date_contrat:debours.date_contrat,
        date_debut:debours.date_debut,
        date_fin:debours.date_fin,
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
              this.selectedItem.date_debut  = formatD(debours.date_debut);
              this.selectedItem.date_fin  = formatD(debours.date_fin);
              this.selectedItem.num_contrat        = debours.num_contrat;
              this.selectedItem.libelle        = debours.libelle;
              this.selectedItem.monnaie        = debours.monnaie;
              this.selectedItem.montant_ht        = debours.montant_ht;
              
            
            
            
            } 
            else 
            {    
              this.row_type = this.row_type.filter((obj)=>
              {                
                return obj.id !== this.currentItem.id;
              });
              this.row_type  = [...this.row_type];
              this.selected     = [];
              this.afficherboutonModifSupr = false;
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        date_contrat: formatD(debours.date_contrat),
                        date_debut: formatD(debours.date_debut),
                        date_fin: formatD(debours.date_fin),
                        num_contrat      : debours.num_contrat,
                        libelle      : debours.libelle,
                        monnaie:debours.monnaie,
                        montant_ht:debours.montant_ht,

                        
                      
                       
                    };
            this.row_type.unshift(item); 
            this.row_type  = [...this.row_type];                   
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
        getId = this.selectedItem_mission.id; 
        
        lib=produit.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        code      :produit.code,
        libelle:produit.libelle,
        associe_resp:produit.associe_resp,
        associate_director:produit.associate_director,
        director:produit.director,
        date_deb_prevue:produit.date_deb_prevue,
        date_fin_prevue:produit.date_fin_prevue,
        senior_manager:produit.senior_manager,
        chef_mission:produit.chef_mission,
        produit:produit.produit,
        id_contrat:this.idcontrat

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('mission',insert_data , config).subscribe((response) =>
      {
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log('manova mission');
              console.log(data);
              this.selectedItem_mission.libelle  = produit.libelle;
              this.selectedItem_mission.code        = produit.code;
              this.selectedItem_mission.associe_resp        = produit.associe_resp;
              this.selectedItem_mission.senior_manager        = produit.senior_manager;  
              this.selectedItem_mission.chef_mission        = produit.chef_mission;  
              this.selectedItem_mission.produit        = produit.produit;    
            
            
            
            } 
            else 
            {    
              this.row_prd = this.row_prd.filter((obj)=>
              {                
                return obj.id !== this.selectedItem_mission.id;
              });
              this.row_prd  = [...this.row_prd];
              this.selected_m     = [];
              this.afficherboutonproduit = false;
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        libelle: produit.libelle,
                        code      : produit.code,
                        id_contrat:this.idcontrat,
                        associe_resp:produit.associe_resp,
                        senior_manager:produit.senior_manager,
                        chef_mission:produit.chef_mission,
                        produit:produit.produit
                      
                       
                    };
            this.row_prd.unshift(item); 
            this.row_prd  = [...this.row_prd];                   
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


  insert_in_base_honoraire = function (produit, suppression)
  {    
    produit=this.selected_phn[0];
    console.log("manova honoraire");
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem_prevhn==false) 
    {
      console.log("maka id");
        getId = this.selectedItem_honoraire.id; 
        
        //lib=produit.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        nbre_jour      :produit.nbre_jour,
        nbre_homme:produit.nbre_homme,
        nbre_heure:produit.nbre_heure,
        grade:produit.grade,
        pu: numberWithoutCommas(produit.pu),
        id_mission:this.idmission

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('prevhonoraire',insert_data , config).subscribe((response) =>
      {
        console.log('manova honoraire 1');
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem_prevhn == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log('manova honoraire 2');
              
              this.selectedItem_honoraire.grade  = produit.grade;
              this.selectedItem_honoraire.nbre_jour        = produit.nbre_jour;
              this.selectedItem_honoraire.nbre_homme        = produit.nbre_homme;
              this.selectedItem_honoraire.nbre_heure        = produit.nbre_heure;  
              this.selectedItem_honoraire.pu        = numberWithoutCommas(produit.pu);  
              this.selectedItem_honoraire.id_mission        = this.idmission;    
            
              this.editprevhn=false;
              this.selectedItem_honoraire.edit=false;
            
            } 
            else 
            {    
              this.row_prevhn = this.row_prevhn.filter((obj)=>
              {                
                return obj.id !==  this.selectedItem_honoraire.id;
              });
              this.row_prevhn  = [...this.row_prevhn];
              this.selected_prevhn     = [];
              this.afficherboutonproduit = false;
              this.somme=totalHT(this.row_prevhn);
  
            }
          }
          else
          {
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
                    this.selectedItem_honoraire.id=item.id;
          //  this.row_prevhn.unshift(item); 
          //  this.row_prevhn  = [...this.row_prevhn];                   
          this.NouvelItem_prevhn   = false;
            this.editprevhn=false;
            this.selectedItem_honoraire.edit=false;
            this.somme=totalHT(this.row_prevhn);
          }
          this.afficherFormproduit = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur honoraire");
        this.dialog.closeAll();
      });
      
  }

  insert_in_base_echeance = function (produit, suppression)
  {    
    produit=this.selected_pech[0];
    console.log("manova honoraire");
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem_ech==false) 
    {
      console.log("maka id");
        getId = this.selectedItem_ech.id; 
        
        //lib=produit.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        nbre_jours      :produit.nbre_jours,
        libelle:produit.libelle,
        pourcentage:produit.pourcentage,
        date_facture:produit.date_facture,
        id_mission:this.idmission

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('echeance_paiement',insert_data , config).subscribe((response) =>
      {
        console.log('manova echeance 1');
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem_prevhn == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log('manova echeance 2');
              
              this.selectedItem_ech.nbre_jours        = produit.nbre_jours;
              this.selectedItem_ech.libelle        = produit.libelle;
              this.selectedItem_ech.pourcentage        = produit.pourcentage;  
              this.selectedItem_honoraire.id_mission        = this.idmission;    
            
              this.editech=false;
              this.selectedItem_ech.edit=false;
            
            } 
            else 
            {    
              this.row_echeance = this.row_echeance.filter((obj)=>
              {                
                return obj.id !==  this.selectedItem_ech.id;
              });
              this.row_echeance  = [...this.row_echeance];
              this.selected_pech     = [];
              this.afficherboutonech = false;
              
  
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        nbre_jours      :produit.nbre_jours,
                        libelle:produit.libelle,
                        pourcentage:produit.pourcentage,
                        id_mission:this.idmission,
                        date_facture:produit.date_facture,
                        edit:false,

                       
                    };
                    this.selectedItem_ech.id=item.id;
          //  this.row_prevhn.unshift(item); 
          //  this.row_prevhn  = [...this.row_prevhn];                   
          this.NouvelItem_ech   = false;
            this.editech=false;
            this.selectedItem_ech.edit=false;
            
          }
         
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur echeance");
        this.dialog.closeAll();
      });
      
  }

  insert_in_base_section = function (produit, suppression)
  {    
    produit=this.selected_psec[0];
    console.log("manova honoraire");
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem_sec==false) 
    {
      console.log("maka id");
        getId = this.selectedItem_sec.id; 
        
        //lib=produit.libelle;
    }
      let config = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      
      let data = 
      {
        id        : getId,
        supprimer :suppression,
        nbre_heure      :produit.nbre_heure,
        grand_tache:produit.grand_tache,
        id_mission:this.idmission

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('prevtache',insert_data , config).subscribe((response) =>
      {
        console.log('manova echeance 1');
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem_prevhn == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              console.log('manova echeance 2');
              
              this.selectedItem_sec.nbre_heure        = produit.nbre_heure;
              this.selectedItem_sec.grand_tache        = produit.grand_tache;
              this.selectedItem_honoraire.id_mission        = this.idmission;    
            
              this.editsec=false;
              this.selectedItem_sec.edit=false;
            
            } 
            else 
            {    
              this.row_prevsec = this.row_prevsec.filter((obj)=>
              {                
                return obj.id !==  this.selectedItem_sec.id;
              });
              this.row_prevsec  = [...this.row_prevsec];
              this.selected_psec     = [];
              this.afficherboutonsec = false;
              
  
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        nbre_heure      :produit.nbre_heure,
                        grand_tache:produit.grand_tache,
                        id_mission:this.idmission,
                        edit:false,

                       
                    };
                    this.selectedItem_sec.id=item.id;
          //  this.row_prevhn.unshift(item); 
          //  this.row_prevhn  = [...this.row_prevhn];                   
          this.NouvelItem_sec   = false;
            this.editsec=false;
            this.selectedItem_sec.edit=false;
            
          }
         
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur echeance");
        this.dialog.closeAll();
      });
      
  }


  insert_in_base_prevdebours = function (produit, suppression)
  {    
    produit=this.selected_pdeb[0];
   
    let getId = 0;
  
    let lib="saraka";
    if (this.NouvelItem_prevdeb==false) 
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
        if (this.NouvelItem_prevdeb == false) 
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
              this.sommedeb=totalDeb(this.row_prevdeb);
              
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
          //  this.row_prevhn.unshift(item); 
            this.row_prevhn  = [...this.row_prevhn];  
            this.selectedItem_pdeb.id=item.id;                 
            this.NouvelItem   = false;
            this.editprevdeb=false;
            this.selectedItem_pdeb.edit=false;
            this.sommedeb=totalDeb(this.row_prevdeb);
            
          }
          this.afficherFormproduit = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur debours");
        this.dialog.closeAll();
      });
      
  }

  onselectchange(event)
  {
    console.log("select change");
  }


   onSelectcontrat(event)
  {  

   
   // this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));
   
    
    console.log("selectionne");
    console.log(this.selectedItem);

    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    this.afficherboutonproduit=false;
    this.afficherFormproduit=false;

    if(!this.selectedItem)
    {
    this.row_prd=this.selected[0].mission;

    this.row_prevhn=[];
    this.row_prevdeb=[];
    this.row_prevsec=[];

    this.selected_m   = [];
    }
    else
    {
      if(this.selectedItem.id!=this.selected[0].id)
      {
        this.row_prd=this.selected[0].mission;

        this.row_prevhn=[];
        this.row_prevdeb=[];
        this.row_prevsec=[];

        this.selected_m   = [];
      }
    }

    if(event.selected)
    {
      this.selectedItem = event.selected[0];
    }
    this.idcontrat=event.selected[0].id;
    this.numcontrat=event.selected[0].num_contrat;
    
      //Filtrer le produit
     


      //Fin filtrer


      
  }

  onSelectmission(event)
  {  
    this.selectedItem_mission = event.selected[0];
    this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));
    this.selected_phn   = [];
    
    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    this.afficherboutonproduit=true;
    this.afficherFormproduit=false;
    this.afficherboutonhonoraire=false;
    this.editprevhn=false;
   
   // let id_type=this.selectedItem.id;
   console.log('afficher mission');
  console.log(this.selectedItem_mission);

  this.idmission=this.selectedItem_mission.id;

   this.index_api.getAllByClient('prevhonoraire',parseInt(this.selectedItem_mission.id),'contrat').subscribe((response) =>
    {      
      this.row_prevhn = [...response['response']];
     
      
      console.log("tafiditra liste prevision honoraire");
     console.log(this.row_prevhn);
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
      this.somme=totalHT(this.row_prevhn);
     



    });

    this.index_api.getAllByClient('prevdebours',parseInt(this.selectedItem_mission.id),'contrat').subscribe((response) =>
    {      
      this.row_prevdeb = [...response['response']];
     
      
     
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
      this.sommedeb=totalDeb(this.row_prevdeb);
     



    });

    this.index_api.getAllByClient('echeance_paiement',parseInt(this.selectedItem_mission.id),'contrat').subscribe((response) =>
    {      
      this.row_echeance = [...response['response']];
     
      
      console.log("tafiditra liste echeance");
      console.log(this.selectedItem_mission.id);
     console.log(this.row_echeance);
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
     // this.somme=totalHT(this.row_prevhn);
     



    });

    this.index_api.getAllByClient('prevtache',parseInt(this.selectedItem_mission.id),'contrat').subscribe((response) =>
    {      
      this.row_prevsec = [...response['response']];
     
      
    
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
      this.somme=totalHT(this.row_prevhn);
     



    });

    
  
   


      
  }
  
  onSelecthonoraire(event)
  {  
    if(this.selectedItem_honoraire)
    {
      

      if(this.selectedItem_honoraire.id!=this.selected_phn[0].id)
      {console.log("tsy mitovy");
      this.selectedItem_honoraire.edit=false;
      this.editprevhn=false;
      if(this.selectedItem_honoraire.id==0)
      {
        this.row_prevhn.shift(); 
        this.row_prevhn  = [...this.row_prevhn];
      } 
      }
      
    }
    if(event.selected )
    {
     this.selectedItem_honoraire = event.selected[0];
    }
   // this.afficherboutonhonoraire = true;
    this.afficherboutonhonoraire=true;
   
   

          
  }

  onSelectprevdebours(event)
  {  
    if(this.selectedItem_pdeb)
    {
      

      if(this.selectedItem_pdeb.id!=this.selected_pdeb[0].id)
      {
        
      this.selectedItem_pdeb.edit=false;
      this.editprevdeb=false;
      if(this.selectedItem_pdeb.id==0)
      {
      //  this.row_prevdeb.shift(); 
      //  this.row_prevdeb  = [...this.row_prevdeb];
      } 
      }
      
    }
    if(event.selected )
    {
      this.selectedItem_pdeb = event.selected[0];
    }
   // this.afficherboutonhonoraire = true;
    this.afficherboutonprevdeb=true;
   console.log("debours selectionne");
   console.log(this.selectedItem_pdeb);

          
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