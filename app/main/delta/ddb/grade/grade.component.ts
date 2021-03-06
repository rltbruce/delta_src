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
    rang:    any;
    
    
  }

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {

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
    chk:MatCheckbox;
    

    step1:  boolean;
    step2:  boolean;

    afficherFormAjoutModif : Boolean;
    afficherboutonModifSupr: Boolean;

    loadingIndicator: boolean;
    reorderable:      boolean;
    rows_debours:      any[];
    rows_actuel:      any[];
    selected = [];
    temp=[];
    isChecked = false;

    columns = [
      { name: 'Code', prop: 'code' }, 
      { name: 'libelle',   prop: 'libelle', sortable: true }, 
      { name: 'rang',  prop: 'rang' }
      ];


  constructor(private _formBuilder: FormBuilder,private index_api: IndexApiService,public dialog: MatDialog)
  {
    // Set the private defaults

    //this.reorderable      = true;
   // this.loadingIndicator = true;
  //  this._unsubscribeAll  = new Subject(); 

    

     
    
  }

  @ViewChild('suppressionDialog', { static: true }) suppressionDialog:TemplateRef<any>;
  @ViewChild('ajoutmodifDialog', { static: true }) ajoutmodifDialog:TemplateRef<any>;
  
    
  ngOnInit(): void {
    
    
    this.NouvelItem = false;
    this.afficherFormAjoutModif  = false;
    this.afficherboutonModifSupr = false;
    this.step1  = false;
    this.step2  = false;
    this.temp = [];

      


    this.deboursForm = this._formBuilder.group(
    {
      id        : [''],
      code      : ['', Validators.required],
      libelle: ['', Validators.required],
      rang   : ['',Validators.required]
     
    });
    this.deboursForm2 = this._formBuilder.group(
      {
        id        : [''],
        code      : ['', Validators.required],
        libelle: ['', Validators.required],
        rang   : ['',Validators.required]
       
       
      });
        
    

    this.index_api.getAll('grade').subscribe((response) =>
    {      
      this.rows_debours = response['response'];
      this.rows_actuel=this.rows_debours;
      
     
     // this.DataSource=response['response'];
     
      this.loadingIndicator = false;
    });

  
  

      
  }

  checkclick(item)
  {
       
    if(this.debours.type_deb==1)
   {
     item.type_deb=0;
     this.debours.type_deb=0;
   
   }
    else
    {
      item.type_deb=1;
    this.debours.type_deb=1;
    
   
    }
    
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
      libelle: null,
      rang   : null
     
    }
   
  }

  updateFilter(event) {
    
    const val = event.target.value.toLowerCase();
   
    this.rows_debours=this.rows_actuel;
   
    let keys = Object.keys(this.rows_debours[0]);
    let colsAmt = this.columns.length;
   
    this.rows_debours =this.rows_debours.filter(function(obj) {
      
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
      libelle: this.selectedItem.libelle,
      rang   : this.selectedItem.rang
      
     
    }
   

    this.afficherFormAjoutModif = true;
    this.NouvelItem = false;
  }
   supprimer()
  {
    this.afficherFormAjoutModif = false;
    this.dialog.open(this.suppressionDialog, { disableClose: true });
  }
  suppressionConfirmer()
  {
    this.ajout( this.selectedItem,1);
  } 
  
  annuler()
  {
    this.afficherFormAjoutModif = false;
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
        rang :parseInt(debours.rang)
       

       
      }

      let insert_data = this.serializeData(data);
      
      this.index_api.add('Grade',insert_data , config).subscribe((response) =>
      {
        //this.selectedItem.nom_client=client.nom_client;
        if (this.NouvelItem == false) 
        {
          
                    // Update or delete: id exclu                    
            if(suppression==0) 
            {
              
              this.selectedItem.libelle  = debours.libelle;
              this.selectedItem.code        = debours.code;
              this.selectedItem.rang   = debours.rang;
            
            
            
            } 
            else 
            {    
              this.rows_debours = this.rows_debours.filter((obj)=>
              {                
                return obj.id !== this.currentItem.id;
              });
              this.rows_debours  = [...this.rows_debours];
              this.selected     = [];
              this.afficherboutonModifSupr = false;
            }
          }
          else
          {
            let item = {
                        id        :String(response.response) ,
                        libelle: debours.libelle,
                        code      : debours.code,
                        rang : debours.rang
                      
                       
                    };
            this.rows_debours.unshift(item); 
            this.rows_debours  = [...this.rows_debours];                   
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

   onSelectdebours(event)
  {  
    this.selectedItem = event.selected[0];
    this.currentItem  = JSON.parse(JSON.stringify(event.selected[0]));
    
    this.step1  = true;
    this.step2  = false;
    this.afficherboutonModifSupr = true;
      
  }
 
 onActivate(event)
 { 
    if (event.type === 'dblclick')
    {
      let deb = 
      {
        id        : event.row.id,
        code      : event.row.code,
        libelle   : event.row.libelle,
        rang  : event.row.rang
       
       
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
