import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { IndexApiService } from '../../../_services/index-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reporting-timesheet',
  templateUrl: './reporting-timesheet.component.html',
  styleUrls: ['./reporting-timesheet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportingTimesheetComponent implements OnInit
{
  filtre :      any;
  filtreForm:   FormGroup;
  allpersonnel :      any[];
  all_timesheet_entete : any[];
  rows_timesheet_entete : any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  item_selected = [];
  type :      any;
  all_detail_situation : any[];
  rows_detail_situation : any[];
  loadingIndicator_detail: boolean;
  reorderable_detail: boolean;
  firstday: Date;
  lastday: Date;
  rows_timesheet_resume : any[];
  loadingIndicator_resume: boolean;
  reorderable_resume: boolean;
  tableColumns_timesheet  :  string[] = ['client','mission', 'section', 'soustache','duree'];
  tableColumns_conge  :  string[] = ['motif','date_debut', 'date_fin','validation'];
  tabindex:any;
  
  all_timesheet_etat : any[];
  rows_timesheet_etat : any[];
  constructor(private _formBuilder: FormBuilder,private index_api: IndexApiService,public datepipe: DatePipe)
  {
    // Set the private defaults
    this.reorderable_detail      = true;
    this.loadingIndicator_detail = true;
    this.rows_detail_situation = [];
    
    this.loadingIndicator_resume = true;
    this.reorderable_resume      = true;
    this.tabindex =2;
    this.all_timesheet_entete = [];
    this.rows_timesheet_entete = [];
    this.rows_timesheet_resume = [];
    // Set the private defaults
    this.reorderable      = true;
    this.loadingIndicator = true;
    this.filtre={date_debut:null,date_fin:null,id_personnel:null};
    this.type = null;
    this.filtreForm = this._formBuilder.group(
      {
        //id        : [''],
        date_debut      : ['', Validators.required],
        date_fin: ['', Validators.required],
        id_personnel: ['', Validators.required]
      });
  }

  ngOnInit(): void
  {
    this.index_api.getAll('personnel').subscribe((resp) =>
      {      
        this.allpersonnel = resp.response;
      });
  }
  resume_cette_semaine()
  {
    var currentDate = new Date();  

    this.firstday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()+1));
    this.lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
    this.index_api.getgeneralise("Timesheet_detail","?menu=getresumesemainewithconge&date_debut_semaine="+this.datepipe.transform(new Date(this.firstday), 'yyyy-MM-dd')+"&date_fin_semaine="+this.datepipe.transform(new Date(this.lastday), 'yyyy-MM-dd')+"&id_personnel="+this.filtre.id_personnel).subscribe(resp =>
      {
        this.rows_timesheet_resume = [...resp.response];
        console.log(this.rows_timesheet_resume);
  
      });
  }
  timesheet_entetebydate_personnel()
  {
    this.tabindex =0;
    this.index_api.getgeneralise("Timesheet_entete","?menu=gettimesheet_entetebydate_personnel&date_debut_semaine="+this.datepipe.transform(new Date(this.filtre.date_debut), 'yyyy-MM-dd')+"&date_fin_semaine="+this.datepipe.transform(new Date(this.filtre.date_fin), 'yyyy-MM-dd')+"&id_personnel="+this.filtre.id_personnel ).subscribe(resp =>
      {
        this.all_timesheet_entete = [...resp.response];
        this.rows_timesheet_entete = resp.response;
        console.log(this.rows_timesheet_entete);
  
      });
  }
  tabClick(tab)
  {
    if (tab.index==0)
    {
      this.rows_timesheet_entete = [...this.all_timesheet_entete];
    }
    if (tab.index==1)
    {
      this.rows_detail_situation = [...this.all_detail_situation];
    }
    if (tab.index==2)
    {
      this.rows_timesheet_resume = [...this.rows_timesheet_resume];
    }
    if (tab.index==3)
    {
      this.index_api.getgeneralise("Timesheet_entete","?menu=gettimesheet_entetebydate_personnel_detail&date_debut_semaine="+this.datepipe.transform(new Date(this.filtre.date_debut), 'yyyy-MM-dd')+"&date_fin_semaine="+this.datepipe.transform(new Date(this.filtre.date_fin), 'yyyy-MM-dd')+"&id_personnel="+this.filtre.id_personnel ).subscribe(resp =>
        {
          
          this.all_timesheet_etat = [resp.response];
          if (resp.response.length!=0)
          {
            this.rows_timesheet_etat = this.all_timesheet_etat[0];           
          }
          else
          {
            this.rows_timesheet_etat=[];
          }
          console.log(this.all_timesheet_etat);
          console.log(this.rows_timesheet_etat);
    
        });
    }
  }
  onSelect({ selected }) {
    
    if (selected[0].type=='timesheet')
    {
      this.index_api.getgeneralise("Timesheet_detail","?menu=getdetailbyentete&id_entete="+selected[0].id+"&id_personnel="+this.filtre.id_personnel).subscribe(resp =>
        {
          this.all_detail_situation = [...resp.response];
          this.rows_detail_situation = resp.response;
          console.log(this.rows_detail_situation);
    
        });
        this.type = 'timesheet';
    }
    if (selected[0].type=='conge')
    {
      this.index_api.getgeneralise("Conge","?menu=getcongebyid&id="+selected[0].id).subscribe(resp =>
        {
          this.all_detail_situation = [...resp.response];
          this.rows_detail_situation = resp.response;
          console.log(this.rows_detail_situation);
    
        });
        this.type = 'conge';
    }
    if (selected[0].type=='absence')
    {
      this.index_api.getgeneralise("Absence","?menu=getabsencebyid&id="+selected[0].id).subscribe(resp =>
        {
          this.all_detail_situation = [...resp.response];
          this.rows_detail_situation = resp.response;
          console.log(this.rows_detail_situation);
    
        });
        this.type = 'absence';
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
  
  affichage_validation(validation)
  {
    let affiche='Encours';
    if (validation==1)
    {
      affiche='Validé';
    }
    if (validation==2)
    {
      affiche='Rejété';
    }
    return affiche;
    //console.log(this.rows_conge[i][c]);
  }
  affichage_type(validation)
  {
    let affiche='Absence';
    if (validation==2)
    {
      affiche='Maladie';
    }
    if (validation==3)
    {
      affiche='Pérmission';
    }
    return affiche;
    //console.log(this.rows_absence[i][c]);
  }
  affichage_type_situation(validation)
  {
    let affiche='En congé';
    if (validation=='timesheet')
    {
      affiche='Time Sheet';
    }
    if (validation=='absence')
    {
      affiche='En pérmission';
    }
    return affiche;
    //console.log(this.rows_absence[i][c]);
  }
  
  affichage_type_absence(validation)
  {
    let affiche='Absence';
    if (parseInt(validation)==2)
    {
      affiche='Absence Maladie';
    }
    if (parseInt(validation)==3)
    {
      affiche='Pérmission';
    }
    return affiche;
    //console.log(this.rows_absence[i][c]);
  }
  updateFilter_date(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["date_feuille","type"];
    
 
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
  
  affichage_validation_conge(validation)
  {
    let affiche='Encours';
    if (validation==1)
    {
      affiche='Validé';
    }
    if (validation==2)
    {
      affiche='Rejété';
    }
    return affiche;
    //console.log(this.rows_conge[i][c]);
  }

}
