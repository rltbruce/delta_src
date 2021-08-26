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

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {

  NouvelItem  : boolean;
    currentItem : any;
    selectedItem: any;

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
    debours :      any;
    produit :      any;
    idcontrat:any;
    idclient:any;
    chk:MatCheckbox;
    

    step1:  boolean;
    step2:  boolean;

    afficherFormAjoutModif : Boolean;
    afficherboutonModifSupr: Boolean;
    afficherFormproduit : Boolean;
    afficherboutonproduit: Boolean;

    loadingIndicator: boolean;
    reorderable:      boolean;
    row_type:      any[];
    rows_actuel:      any[];
    row_prd:      any[];
    row_prevhn:      any[];
    rows_prdactuel:      any[];
    row_client:      any[];
    rows_monnaie:      any[];
    row_personnel:      any[];
    row_produit:      any[];
    selected = [];
    selected_m = [];
    selected_phn = [];
    temp=[];
    isChecked = false;

    columns = [
      { name: 'Code', prop: 'code' }, 
      { name: 'libelle',   prop: 'libelle', sortable: true } 
      
      ];

      columns_hn = [
        { name: 'Grade', prop: 'grade' }, 
        { name: 'nbre_jour',   prop: 'nbre_jour', sortable: true }, 
        { name: 'nbre_homme',   prop: 'nbre_homme', sortable: true }, 
        { name: 'nbre_heure',   prop: 'nbre_heure', sortable: true },
        { name: 'Duree_totale',   prop: 'duree_totale', sortable: true }  
        
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
  @ViewChild('ajoutmodifDialog', { static: true }) ajoutmodifDialog:TemplateRef<any>;
  @ViewChild('saisieDialog', { static: true }) saisieDialog:TemplateRef<any>;
  @ViewChild('missionDialog', { static: true }) missionDialog:TemplateRef<any>;
    
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

    this.deboursForm2 = this._formBuilder.group(
      {
        id        : [''],
        code      : ['', Validators.required],
        libelle: ['', Validators.required],
        associe_resp: ['', Validators.required],
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

   
      
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  changemonnaie(event)
  {
    
    console.log(event.value);
    //if(event)
   // this.lib=event.value;
  }

  changeclient(event)
  {
    
    console.log(event.value);
    this.idclient=event.value;

    this.index_api.getAllByClient('contrat',parseInt(event.value)).subscribe((response) =>
    {      
      this.row_type = response['response'];
      this.rows_actuel=this.row_type;
      
      console.log("tafiditra liste contrat nofidina");
      console.log(this.row_type);
      this.row_prd=null;
      this.row_prevhn=null;
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });
    
  /*  this.index_api.getAllByClient('mission',parseInt(event.value)).subscribe((response) =>
    {      
      this.row_prd = response['response'];
     
      
      console.log("tafiditra liste mission nofidina");
      console.log(this.row_prd);
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });*/
    

    //if(event)
   // this.lib=event.value;
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
    this.NouvelItem = true;
    this.produit     = {}
    this.selected_m   = [];
    let deb = 
    {
      id        : null,
      code      : null,
      libelle: null,
      associe_resp:null,
      senior_manager:null,
      chef_mission:null,
      produit:null
    
     
    }
    this.dialog.open(this.missionDialog, { disableClose: true });
   
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
      id        : this.selectedItem.id,
      code      : this.selectedItem.code,
      libelle: this.selectedItem.libelle,
      associe_resp: this.selectedItem.associe_resp,
      senior_manager: this.selectedItem.senior_manager,
      chef_mission: this.selectedItem.chef_mission,
      produit:this.selectedItem.produit,
      
      
     
    }
   

    this.afficherFormAjoutModif = false;
    //this.afficherFormproduit = true;
    this.NouvelItem = false;
    this.dialog.open(this.missionDialog, { disableClose: true });
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
  suppressionConfirmer()
  {
    this.ajout( this.selectedItem,1);
  } 

  suppressionConfirmer_produit()
  {
    this.ajout_produit( this.selectedItem,1);
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

  changegrade(event)
  {
    
    console.log(event.value);
    //if(event)
   // this.lib=event.value;
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
                        num_contrat      : debours.num_contrat,
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
    if (this.NouvelItem==false) 
    {
      console.log("maka id");
        getId = this.selectedItem.id; 
        
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
              this.selectedItem.libelle  = produit.libelle;
              this.selectedItem.code        = produit.code;
              this.selectedItem.associe_resp        = produit.associe_resp;
              this.selectedItem.senior_manager        = produit.senior_manager;  
              this.selectedItem.chef_mission        = produit.chef_mission;  
              this.selectedItem.produit        = produit.produit;    
            
            
            
            } 
            else 
            {    
              this.row_prd = this.row_prd.filter((obj)=>
              {                
                return obj.id !== this.currentItem.id;
              });
              this.row_prd  = [...this.row_prd];
              this.selected     = [];
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
            this.NouvelItem   = false;
          }
          this.afficherFormproduit = false ;
          this.dialog.closeAll();
      },error =>
      {
        console.log("erreur");
        this.dialog.closeAll();
      });
      
  }


   onSelectdebours(event)
  {  
    this.selectedItem = event.selected[0];
    this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));
    
    console.log("selectionne");
    console.log(this.selectedItem);

    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    this.afficherboutonproduit=false;
    this.afficherFormproduit=false;
    this.idcontrat=this.selectedItem.id;
    
//Filtrer le produit
this.row_prd=this.selectedItem.mission;
//console.log(this.row_prd);
/*this.row_prd =this.row_prd.filter(function(obj) {
     return obj.type_prd==id_type;  
 
}); */



//Fin filtrer


      
  }

  onSelectproduit(event)
  {  
    this.selectedItem = event.selected[0];
    this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));
    
    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    this.afficherboutonproduit=true;
    this.afficherFormproduit=false;
   // let id_type=this.selectedItem.id;
   console.log('afficher mission');
  console.log(this.selectedItem);


   this.index_api.getAllByClient('prevhonoraire',parseInt(this.selectedItem.id)).subscribe((response) =>
    {      
      this.row_prevhn = response['response'];
     
      
      console.log("tafiditra liste prevision honoraire");
     console.log(this.row_prevhn);
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

    
  
   /* this.index_api.getAll('prevhonoraire').subscribe((response) =>
    {      
      this.row_client = response['response'];
       console.log("tafiditra liste prevision honoraire");
      console.log(this.row_prevhn);
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });*/


      
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