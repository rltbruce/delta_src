import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentification.service';
import { IndexApiService } from '../../../_services/index-api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
class obj
  {
    constructor() {}
    id:         string;
    date:       string;
    id_personnel: string;
    
  }
@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeSheetComponent implements OnInit
{
  
  tableColumns  :  string[] = ['mission', 'soustache','duree'];
  filtre_enteteForm:   FormGroup;
  enteteForm:   FormGroup;
  filtre :      any;  
  firstday: Date;
  lastday: Date;
  datenow: Date;
  userConnecte: any;
  currentpersonnel: any;

  all_timesheet_entete : any[];
  rows_timesheet_entete : any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  item_selected = [];
  editing = {};
  new_item : boolean;
  index_selected : number;  
  currentItem_entete : any;
  
  all_timesheet_detail : any[];
  rows_timesheet_detail : any[];
  loadingIndicator_detail: boolean;
  reorderable_detail: boolean;
  item_selected_detail = [];
  editing_detail = {};
  new_item_detail : boolean;
  index_selected_detail : number;  
  currentItem_detail : any;
  tabindex:any;
  all_mission : any[];
  all_client : any[];
  all_sous_tache : any[];
  
  rows_timesheet_resume : any[];
  loadingIndicator_resume: boolean;
  reorderable_resume: boolean;
  constructor(private _formBuilder: FormBuilder,private authenticationservice: AuthenticationService,private index_api: IndexApiService,public dialog: MatDialog)
  {
    // Set the private defaults
    this.reorderable      = true;
    this.loadingIndicator = true;
    this.new_item = false ;

    // Set the private defaults
    this.reorderable_detail      = true;
    this.loadingIndicator_detail = true;
    this.new_item_detail = false ;
    this.rows_timesheet_detail = [];
    this.datenow = new Date();
    this.currentpersonnel={id: "", code: "", nom: ""};
    if (this.authenticationservice.currentUserValue)
    {
      this.userConnecte = this.authenticationservice.currentUserValue; 
    }
    var currentDate = new Date();  

    this.firstday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    this.lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
    this.filtre={date_debut_semaine:this.firstday, date_fin_semaine:this.lastday};

    if (this.userConnecte)
    {
      this.index_api.getgeneralise('timesheet_entete',"?menu=get_personel&id_personnel="+this.userConnecte.id_pers).subscribe((resp) =>
      {      
        this.currentpersonnel = resp.response;
      });
      //get timesheet par semaine
      this.index_api.getgeneralise("Timesheet_entete","?menu=gettimesheet_entetebysemaine&date_debut_semaine="+this.convertionDate(this.firstday)+"&date_fin_semaine="+this.convertionDate(this.lastday)+"&id_personnel="+this.userConnecte.id_pers ).subscribe(resp =>
      {
        this.all_timesheet_entete = [...resp.response];
        this.rows_timesheet_entete = resp.response;
        console.log(this.rows_timesheet_entete);
  
      });
    }
    

    // Set the private defaults
    
    //this.item_selected_detail = {};
    
  }
  updateFilter_entete(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","date_feuille"];
    
 
    if (val == "") 
    {
      this.rows_timesheet_entete = this.all_timesheet_entete;

    }
    else 
    {
      // filter our data
      const temp = this.all_timesheet_entete.filter(function (d) {
        let reps = "";
        ent.forEach(el => {

          if (el != 'id') {
            reps = reps + "(d." + el + ".toLowerCase().indexOf(val) !== -1 ) ||";

          }

        });

        reps = reps + "!val";

        return eval(reps);    //string to code source

      });

      // update the rows
      this.rows_timesheet_entete = temp; 
      
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }
  updateFilter_detail(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","mission.libelle","libelle","sous_tache.libelle","pourcentage","duree"];
    
 
    if (val == "") 
    {
      this.rows_timesheet_detail = this.all_timesheet_detail;

    }
    else 
    {
      // filter our data
      const temp = this.all_timesheet_detail.filter(function (d) {
        let reps = "";
        ent.forEach(el => {

          if (el != 'id') {
            reps = reps + "(d." + el + ".toLowerCase().indexOf(val) !== -1 ) ||";

          }

        });

        reps = reps + "!val";

        return eval(reps);    //string to code source

      });

      // update the rows
      this.rows_timesheet_detail = temp; 
      
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }
  @ViewChild('suppressionDialog', { static: true }) suppressionDialog:TemplateRef<any>;
   @ViewChild('suppressionDialog_detail', { static: true }) suppressionDialog_detail:TemplateRef<any>;
  ngOnInit(): void
  { 
    this.tabindex=0;
    this.filtre_enteteForm = this._formBuilder.group(
      {
        //id        : [''],
        date_debut_semaine      : ['', Validators.required],
        date_fin_semaine: ['', Validators.required]
      });
    //get timesheet par semaine
    this.index_api.getAll("Client").subscribe(resp =>
      {
        this.all_client = resp.response;
        console.log(this.all_client);
      });
    this.index_api.getgeneralise("Mission","?menu=getallmission").subscribe(resp =>
      {
        this.all_mission = resp.response;
        console.log(this.all_mission);
      });
      
      this.index_api.getAll("Soussection").subscribe(resp =>
        {
          this.all_sous_tache = resp.response;
        });
        this.index_api.getgeneralise("Timesheet_detail","?menu=getresumesemaine&date_debut_semaine="+this.convertionDate(this.firstday)+"&date_fin_semaine="+this.convertionDate(this.lastday)+"&id_personnel="+this.userConnecte.id_pers).subscribe(resp =>
          {
            this.rows_timesheet_resume = resp.response;
            console.log(this.rows_timesheet_resume);
      
          });
  }
  
  timesheet_entetebysemaine()
  {
    this.index_api.getgeneralise("Timesheet_entete","?menu=gettimesheet_entetebysemaine&date_debut_semaine="+this.convertionDate(this.filtre.date_debut_semaine)+"&date_fin_semaine="+this.convertionDate(this.filtre.date_fin_semaine)+"&id_personnel="+this.userConnecte.id_pers ).subscribe(resp =>
      {
        this.all_timesheet_entete = [...resp.response];
        this.rows_timesheet_entete = resp.response;
        console.log(this.rows_timesheet_entete);
  
      });
  }
  onSelect({ selected }) {
    
    if (selected) {
      this.index_selected = this.rows_timesheet_entete.indexOf(selected[0]) ;      
      this.currentItem_entete  = JSON.parse(JSON.stringify(selected[0]));
    }
    
  }
  ajouter()
  {

    this.new_item = true ;
    let item = 
    {
      id:'0',
      date_feuille:''
    } ;

    this.rows_timesheet_entete.unshift(item);

    this.rows_timesheet_entete = [...this.rows_timesheet_entete];
    
    this.editing[0] = true;
    this.index_selected = 0;
    
    if (this.item_selected.length > 0) {
      this.item_selected[0] = item;
    }
    else 
    {
      this.item_selected.push(item);
    }
   console.log(this.editing);
    
  }
  modifier() {
    this.editing[this.index_selected] = true; 
    console.log(this.editing); 
  }

  annuler()
  {
    
    this.editing[this.index_selected] = false;
    this.item_selected = [];
    if (this.new_item ) 
    {
      this.new_item = false;
      this.rows_timesheet_entete.shift();
      this.rows_timesheet_entete = [...this.rows_timesheet_entete];
      this.all_timesheet_entete = [...this.rows_timesheet_entete];
    }else
    {
      this.rows_timesheet_entete[this.index_selected]=this.currentItem_entete;      
      this.rows_timesheet_entete = [...this.rows_timesheet_entete];
    }
  }
  

  //EQUIVALENT $.param 
  private convertion_data(data) {
    var buffer = [];

    // Serialize each key in the object.
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }

      var value = data[name];

      buffer.push(
        encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
      );
    }

    var source = buffer.join("&").replace(/%20/g, "+");
    return (source);
  }

  save_in_base(etat_suppression)
  {
    

    this.editing[this.index_selected] = false;
    

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    let data =
    {
      id: this.item_selected[0].id,
      supprimer: etat_suppression,
      date_feuille: this.convertionDate(this.item_selected[0].date_feuille),
      id_pers: this.currentpersonnel.id
    }

console.log(data);
    this.index_api.add('Timesheet_entete', this.convertion_data(data), config).subscribe((response) => {
     

      if (!this.new_item) 
      {
        if (etat_suppression == 1) 
        {
          this.all_timesheet_entete.splice(this.index_selected, 1);
          this.all_timesheet_entete = [...this.all_timesheet_entete];
          this.rows_timesheet_entete = [...this.all_timesheet_entete];
          
        }
      }
      else
      {
        this.new_item = false;
        this.rows_timesheet_entete[this.index_selected]['id'] = String(response['response']);
        this.all_timesheet_entete = [...this.rows_timesheet_entete];
      }

      this.item_selected = [];
      this.dialog.closeAll();
    }, error => {
      alert("erreur");
    });
    
    
  }

  updateValue(e,c,i)
  {
    
    this.rows_timesheet_entete[i][c] = e.target.value;
    
    console.log(this.rows_timesheet_entete[i][c]);
    console.log(e);
    console.log(c);
    console.log(i);
  }


  supprimer()
  {
    this.dialog.open(this.suppressionDialog, { disableClose: true });
  }
  suppressionConfirmer()
  {
    this.save_in_base(1);
  }

 
 /* private serializeData( data )
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
    }*/
   
  /***********Debut Detail time sheet */
  tabClick(tab)
  {
    if (tab.index==0)
    {
      this.index_api.getgeneralise("Timesheet_detail","?cle_etrangere="+this.item_selected[0].id).subscribe(resp =>
        {
          this.all_timesheet_detail = [...resp.response];
          this.rows_timesheet_detail = resp.response;
          console.log(this.rows_timesheet_detail);
    
        });
    }
    if (tab.index==1)
    {
      var date = new Date();
      var days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
      console.log(days[date.getDay()]);
      this.index_api.getgeneralise("Timesheet_detail","?menu=getresumesemaine&date_debut_semaine="+this.convertionDate(this.firstday)+"&date_fin_semaine="+this.convertionDate(this.lastday)+"&id_personnel="+this.userConnecte.id_pers).subscribe(resp =>
        {
          this.rows_timesheet_resume = resp.response;
          console.log(this.rows_timesheet_resume);
    
        });
    }
  }
  onSelect_detail({ selected }) {
    
    if (selected) {
      this.index_selected_detail = this.rows_timesheet_detail.indexOf(selected[0]) ;      
      this.currentItem_detail  = JSON.parse(JSON.stringify(selected[0]));
    }
    
  }
  ajouter_detail()
  {

    this.new_item_detail = true ;
    let item = 
    {
      id:'0',
      sous_tache:{id: null,
                  libelle:''},
      mission:{id: null,
                              libelle:''}
    } ;

    this.rows_timesheet_detail.unshift(item);

    this.rows_timesheet_detail = [...this.rows_timesheet_detail];
    
    this.editing_detail[0] = true;
    this.index_selected_detail = 0;
    
    if (this.item_selected_detail.length > 0) {
      this.item_selected_detail[0] = item;
    }
    else 
    {
      this.item_selected_detail.push(item);
    }
   console.log(this.editing_detail);
    
  }
  modifier_detail() {
    this.editing_detail[this.index_selected_detail] = true; 
    console.log(this.editing_detail); 
  }

  annuler_detail()
  {
    
    this.editing_detail[this.index_selected_detail] = false;
    this.item_selected_detail = [];
    if (this.new_item_detail ) 
    {
      this.new_item_detail = false;
      this.rows_timesheet_detail.shift();
      this.rows_timesheet_detail = [...this.rows_timesheet_detail];
      this.all_timesheet_detail = [...this.rows_timesheet_detail];
    }else
    {
      this.rows_timesheet_detail[this.index_selected]=this.currentItem_detail;      
      this.rows_timesheet_detail = [...this.rows_timesheet_detail];
    }
  }
  
  save_in_base_detail(etat_suppression)
  {
    

    this.editing_detail[this.index_selected_detail] = false;
    

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    let data =
    {
      id: this.item_selected_detail[0].id,
      supprimer: etat_suppression,
      date_feuille: this.convertionDate(this.item_selected[0].date_feuille),
      id_pers: this.currentpersonnel.id
    }

console.log(data);
    this.index_api.add('Timesheet_detail', this.convertion_data(data), config).subscribe((response) => {
     

      if (!this.new_item) 
      {
        if (etat_suppression == 1) 
        {
          this.all_timesheet_detail.splice(this.index_selected_detail, 1);
          this.all_timesheet_detail = [...this.all_timesheet_detail];
          this.rows_timesheet_detail = [...this.all_timesheet_detail];
          
        }
      }
      else
      {
        this.new_item_detail = false;
        this.rows_timesheet_detail[this.index_selected]['id'] = String(response['response']);
        this.all_timesheet_detail = [...this.rows_timesheet_detail];
      }

      this.item_selected_detail = [];
      this.dialog.closeAll();
    }, error => {
      alert("erreur");
    });
    
    
  }

  updateValue_detail(e,c,i)
  {
    console.log(e);
    console.log(c);
    console.log(i);
    //this.rows_timesheet_detail[i][c] = e.target.value;
    
    //console.log(this.rows_timesheet_detail[i][c]);
  }


  supprimer_detail()
  {
    this.dialog.open(this.suppressionDialog_detail, { disableClose: true });
  }
  suppressionConfirmer_detail()
  {
    this.save_in_base_detail(1);
  }
  
  /***********Fin Detail time sheet */   
    
  public convertionDate(daty)
  {   
    if(daty)
    {
        let date     = new Date(daty);
        let jour  = date.getDate();
        let mois  = date.getMonth()+1;
        let annee = date.getFullYear();
        var date_final;
        if(mois <10)
        {
            date_final= annee+"-"+"0"+mois+"-"+jour;
        }
        else
        {
          date_final= annee+"-"+mois+"-"+jour;
        }
        
        return date_final
    }      
  }
  formatDate(daty)
  {
    if (daty) 
    {
      var date  = new Date(daty);
      var m  = date.getMonth()+1;
      var j  = date.getDate();
      var mois =null;
      var jours =null;
      if(m <10)
      {
          mois= "0"+m;
      }
      else
      {
        mois=date.getMonth()+1;
      }
      if(j <10)
      {
        jours= "0"+j;
      }
      else
      {
        jours  = date.getDate();
      }
      var dates = (jours+"-"+mois+"-"+date.getFullYear());
      return dates;
    }           

  }

}