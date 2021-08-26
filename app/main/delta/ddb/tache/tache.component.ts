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

class obj
  {
    constructor() {}
    id:         string;
    code:       string;
    libelle: string;
   
    
  }

@Component({
  selector: 'app-tache',
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.scss']
})
export class TacheComponent implements OnInit {

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
    debours :      any;
    produit :      any;
    idtype:any;
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
    rows_prdactuel:      any[];
    selected = [];
    temp=[];
    isChecked = false;

    columns = [
      { name: 'Code', prop: 'code' }, 
      { name: 'libelle',   prop: 'libelle', sortable: true } 
      
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
      code      : ['', Validators.required],
      libelle: ['', Validators.required],
      
     
    });
    this.deboursForm2 = this._formBuilder.group(
      {
        id        : [''],
        code      : ['', Validators.required],
        libelle: ['', Validators.required],
        ponderation: ['', ''],
     
       
       
      });
        
    

    this.index_api.getAll('tache').subscribe((response) =>
    {      
      this.row_type = response['response'];
      this.rows_actuel=this.row_type;
      
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

  
    this.index_api.getAll('soustache').subscribe((response) =>
    {      
      this.row_prd = response['response'];
      this.rows_prdactuel=this.row_prd;
      
      this.row_prd =this.row_prd.filter(function(obj) {
        return obj.grand_tache==0;  
    
   }); 

     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });


      
  }

 
  
   ajouter()
  {
    this.afficherFormAjoutModif   = true;
    this.afficherboutonModifSupr  = false;
    this.NouvelItem = true;
    this.debours     = {}
    this.selected   = [];
    let deb = 
    {
      id        : null,
      code      : null,
      libelle: null
    
     
    }
   
  }

  ajouter_produit()
  {
    this.afficherFormAjoutModif   = false;
    this.afficherFormproduit   = true;
    this.afficherboutonModifSupr  = false;
    this.NouvelItem = true;
    this.produit     = {}
    this.selected   = [];
    let deb = 
    {
      id        : null,
      code      : null,
      libelle: null,
      ponderation: null
    
     
    }
   
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
      code      : this.selectedItem.code,
      libelle: this.selectedItem.libelle
      
      
     
    }
   

    this.afficherFormAjoutModif = true;
    this.NouvelItem = false;
  }

  modifier_produit()
  {
    this.produit = 
    {
      id        : this.selectedItem.id,
      code      : this.selectedItem.code,
      libelle: this.selectedItem.libelle
      
      
     
    }
   

    this.afficherFormAjoutModif = false;
    this.afficherFormproduit = true;
    this.NouvelItem = false;
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
  }

  annuler_produit()
  {
    this.afficherFormproduit = false;
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
        code      :debours.code,
        libelle:debours.libelle,
       

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('Tache',insert_data , config).subscribe((response) =>
      {
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              
              this.selectedItem.libelle  = debours.libelle;
              this.selectedItem.code        = debours.code;
              
            
            
            
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
                        libelle: debours.libelle,
                        code      : debours.code
                        
                      
                       
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
       grand_tache:this.idtype,
       ponderation:produit.ponderation

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('soustache',insert_data , config).subscribe((response) =>
      {
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              
              this.selectedItem.libelle  = produit.libelle;
              this.selectedItem.code        = produit.code;
              this.selectedItem.grand_tache        = produit.grand_tache;  
              this.selectedItem.ponderation        = produit.ponderation;  
            
            
            
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
                        grand_tache:this.idtype,
                        ponderation:produit.ponderation,
                      
                       
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
    
    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
    this.afficherboutonproduit=false;
    this.afficherFormproduit=false;
    this.idtype=this.selectedItem.id;
    let id_type=this.selectedItem.id;
//Filtrer le produit
this.row_prd=this.rows_prdactuel;
this.row_prd =this.row_prd.filter(function(obj) {
     return obj.grand_tache==id_type;  
 
}); 



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

console.log('afficher produit');
console.log(this.selectedItem);

      
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