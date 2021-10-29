import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentification.service';
import { IndexApiService } from '../../../_services/index-api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  
  tableColumns  :  string[] = ['client','mission', 'section', 'soustache','duree'];
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
  all_section : any[];
  all_sous_section : any[];
  duree_cumule:any;
  
  rows_timesheet_resume : any[];
  loadingIndicator_resume: boolean;
  reorderable_resume: boolean;
  constructor(private _formBuilder: FormBuilder,private authenticationservice: AuthenticationService,private index_api: IndexApiService,public dialog: MatDialog,public datepipe: DatePipe)
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

    this.firstday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()+1));
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
    
     let ent = ["id","mission.libelle","libelle","sous_section.libelle","pourcentage","duree"];
    
 
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
   @ViewChild('avertissementDialog_timesheet', { static: true }) avertissementDialog_timesheet:TemplateRef<any>;
  ngOnInit(): void
  { 
    this.tabindex=1;
    this.duree_cumule = 0;
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
    /*this.index_api.getgeneralise("Mission","?menu=getallmission").subscribe(resp =>
      {
        this.all_mission = resp.response;
        console.log(this.all_mission);
      });*/
      
      /*this.index_api.getAll("Section").subscribe(resp =>
        {
          this.all_section = resp.response;
        });
      this.index_api.getAll("Soussection").subscribe(resp =>
        {
          this.all_sous_section = resp.response;
        });*/
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
    
    if (selected)
    {
      this.index_selected = this.rows_timesheet_entete.indexOf(selected[0]) ;      
      this.currentItem_entete  = JSON.parse(JSON.stringify(selected[0]));
      this.tabindex = 0;
      this.index_api.getgeneralise("Timesheet_detail","?menu=getdetailbyentete&id_entete="+selected[0].id+"&id_personnel="+this.userConnecte.id_pers).subscribe(resp =>
        {
          this.all_timesheet_detail = [...resp.response];
          this.rows_timesheet_detail = resp.response;
          console.log(this.rows_timesheet_detail);
    
        });
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
  verification_avant_save(etat_suppression)
  {
    var msg={
              titre:"AVERTISSEMENT",
              corps: "Cette date existe dans congé ou absence"
            };
            console.log(this.datepipe.transform(new Date(this.item_selected[0].date_feuille), 'yyyy-MM-dd'));
    this.index_api.getgeneralise('conge',"?menu=getcongeencouretvalidebydate&id_personnel="
    +this.userConnecte.id_pers+"&date_feuille="+this.datepipe.transform(new Date(this.item_selected[0].date_feuille), 'yyyy-MM-dd')).subscribe((resp) =>
    {  
      console.log(resp.response);
      if (resp.response.length!=0)
      {
        this.dialog.open(this.avertissementDialog_timesheet, { disableClose: true,data: msg });        
      }
      else
      {
        this.save_in_base(etat_suppression);
      }
          
    });
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
    {console.log(this.item_selected[0].id);
      this.index_api.getgeneralise("Timesheet_detail","?menu=getdetailbyentete&id_entete="+this.item_selected[0].id+"&id_personnel="+this.userConnecte.id_pers).subscribe(resp =>
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
      sous_section:{id: null, libelle:''},
      mission:{ id: null, libelle:''},
      client:{id: null, nom:''},
      section:{id: null, libelle:''},
      pourcentage:0,
      duree:0,
      duree_cumule:0
    } ;

    this.rows_timesheet_detail.unshift(item);
    
    this.index_selected_detail = 0;
    
    if (this.item_selected_detail.length > 0) {
      this.item_selected_detail[0] = item;
    }
    else 
    {
      this.item_selected_detail.push(item);
    }
    this.editing_detail[0] = true;
   console.log(this.item_selected_detail);
   this.rows_timesheet_detail = [...this.rows_timesheet_detail];
    
  }
  modifier_detail()
  {
    this.editing_detail[this.index_selected_detail] = true;  
    this.index_api.getgeneralise("Mission","?menu=getmissionbyclient&id_client="+this.item_selected_detail[0].id).subscribe(resp_mis =>
    {
      this.all_mission = resp_mis.response;  
    });
    this.index_api.getgeneralise("Timesheet_detail","?menu=getsectionbymission&id_mission="+this.item_selected_detail[0].mission.id).subscribe(resp_sec =>
    {          
      this.all_section = resp_sec.response;
    });
    this.index_api.getgeneralise("Timesheet_detail","?menu=getsous_sectionbysection&id_section="+this.item_selected_detail[0].section.id).subscribe(resp_sec =>
    {          
      this.all_sous_section = resp_sec.response;
    });
    this.duree_cumule= parseFloat(this.item_selected_detail[0].duree_cumule) - parseFloat(this.item_selected_detail[0].duree);
    this.new_item_detail = false ;
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
      this.rows_timesheet_detail[this.index_selected_detail]=this.currentItem_detail;      
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
      id_client: this.item_selected_detail[0].client.id,
      id_mission: this.item_selected_detail[0].mission.id,
      id_section: this.item_selected_detail[0].section.id,
      id_sous_section: this.item_selected_detail[0].sous_section.id,
      pourcentage: this.item_selected_detail[0].pourcentage,
      duree: this.item_selected_detail[0].duree,
      id_entete: this.item_selected[0].id
    }
    console.log(this.item_selected_detail[0]);
  console.log(data);
    this.index_api.add('Timesheet_detail', this.convertion_data(data), config).subscribe((response) => {
     

      if (!this.new_item_detail) 
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
        this.rows_timesheet_detail[this.index_selected_detail]['id'] = String(response['response']);
        this.all_timesheet_detail = [...this.rows_timesheet_detail];
      }

      this.item_selected_detail = [];
      this.dialog.closeAll();
    }, error => {
      alert("erreur");
    });
    
    
  }

  updateValue_detail(e,c,i)
  {console.log(e);
    this.rows_timesheet_detail[i][c] = e.target.value;
    
    //console.log(this.rows_timesheet_detail[i][c]);
  }
  
  updateValue_select_client(e,c,i)
  {
    var cli= this.all_client.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_timesheet_detail[i][c] = {id: String(e.value),nom_client: cli[0].nom_client};
    this.rows_timesheet_detail[i]['mission.nom_client'] = cli[0].nom_client;
    this.rows_timesheet_detail[i]['mission'] = {id: null,libelle: null};
    this.rows_timesheet_detail[i]['section'] = {id: null,libelle: null};
    this.rows_timesheet_detail[i]['sous_section'] = {id: null,libelle: null};
    this.index_api.getgeneralise("Mission","?menu=getmissionbyclient&id_client="+e.value).subscribe(resp_mis =>
      {
        this.all_mission = resp_mis.response;  
      });
  }
  updateValue_select_mission(e,c,i)
  {
    var mis= this.all_mission.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_timesheet_detail[i][c] = {id: String(e.value),libelle: mis[0].libelle};
    this.rows_timesheet_detail[i]['section'] = {id: null,libelle: null};
    this.rows_timesheet_detail[i]['sous_section'] = {id: null,libelle: null};
    this.index_api.getgeneralise("Timesheet_detail","?menu=getsectionbymission&id_mission="+e.value).subscribe(resp_sec =>
      {
        if (resp_sec.response.length!=0)
        {          
          this.all_section = resp_sec.response;
          console.log(this.all_section);
        }
        else
        {
          this.index_api.getAll("Section").subscribe(resp =>
            {
              this.all_section = resp.response;
              console.log(this.all_section);
            });
        }
        
  
      });
  }
  updateValue_select_section(e,c,i)
  {
    var sec= this.all_section.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_timesheet_detail[i][c] = {id: String(e.value),libelle: sec[0].libelle};
    this.rows_timesheet_detail[i]['sous_section'] = {id: null,libelle: null};
    this.index_api.getgeneralise("Timesheet_detail","?menu=getsous_sectionbysection&id_section="+e.value).subscribe(resp_sec =>
      {          
          this.all_sous_section = resp_sec.response;
          console.log(resp_sec.response);
      });
  }
  updateValue_duree(e,c,i,row)
  {
    if (e.target.value)
    {
      this.rows_timesheet_detail[i][c] = e.target.value;
      var dure_cumul= parseFloat(e.target.value) +  parseFloat(this.duree_cumule);
      this.rows_timesheet_detail[i]['duree_cumule'] =dure_cumul;
    }
    else
    {
      var dure_cumul= parseFloat(this.duree_cumule);
      this.rows_timesheet_detail[i]['duree_cumule'] =dure_cumul;
    }
    
    
  }
  updateValue_sous_section(e,c,i,row)
  {var sous_sec= this.all_sous_section.filter(function(obj) {

    return obj.id == e.value;
  });
  this.rows_timesheet_detail[i][c] = {id: String(e.value),libelle: sous_sec[0].libelle};
    console.log(row);
    this.index_api.getgeneralise("Timesheet_detail","?menu=getdureeanterieur&id_sous_section="+e.value+"&id_section="+row.section.id+"&id_mission="+row.mission.id).subscribe(resp_dur =>
      {          
          var duree = resp_dur.response;
          console.log(resp_dur.response);
          if (duree.length!=0)
          {
            if (duree[0].som)
            {
              this.rows_timesheet_detail[i]['duree_cumule'] = duree[0].som;
              this.duree_cumule=duree[0].som;
            }
            else
            {
              this.rows_timesheet_detail[i]['duree_cumule'] = 0;
              this.duree_cumule=0;
            }
          }
          else
          {
            this.rows_timesheet_detail[i]['duree_cumule'] = 0;
            this.duree_cumule=0;
          }
          
          console.log(this.rows_timesheet_detail[i]['duree_cumule']);
      });
  }

  supprimer_detail()
  {
    this.dialog.open(this.suppressionDialog_detail, { disableClose: true });
  }
  suppressionConfirmer_detail()
  {
    this.save_in_base_detail(1);
  }
  closeDialog()
  {
    this.dialog.closeAll();
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