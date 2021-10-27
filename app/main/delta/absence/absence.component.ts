import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentification.service';
import { IndexApiService } from '../../../_services/index-api.service';
import {MatDialog} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent implements OnInit
{
  all_absence : any[];
  rows_absence : any[];
  loadingIndicator_absence: boolean;
  reorderable_absence: boolean;
  item_selected_absence = [];
  editing_absence = {};
  new_item_absence : boolean;
  index_selected_absence : number;  
  currentItem_absence : any;
  userConnecte: any;
  currentpersonnel: any;

  constructor(private authenticationservice: AuthenticationService,private index_api: IndexApiService,public dialog: MatDialog,public datepipe: DatePipe)
  {
    // Set the private defaults
    this.reorderable_absence      = true;
    this.loadingIndicator_absence = true;
    this.new_item_absence = false ;
    this.rows_absence = [];
    if (this.authenticationservice.currentUserValue)
    {
      this.userConnecte = this.authenticationservice.currentUserValue; 
      if (this.userConnecte)
      { 
        this.index_api.getgeneralise('timesheet_entete',"?menu=get_personel&id_personnel="+this.userConnecte.id_pers).subscribe((resp) =>
        {      
          this.currentpersonnel = resp.response;
        });
        this.index_api.getgeneralise('absence',"?menu=getabsencebypersonnel&id_personnel_absent="+this.userConnecte.id_pers).subscribe((resp) =>
        {      
          this.rows_absence = resp.response;
          this.all_absence = [...resp.response];
          console.log(this.rows_absence);
        });
      }
    }

   }
   updateFilter_absence(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","type","motif","date_debut","date_fin","duree","personnel_absent.nom","validation"];
    
 
    if (val == "") 
    {
      this.rows_absence = this.all_absence;

    }
    else 
    {
      // filter our data
      const temp = this.all_absence.filter(function (d) {
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
      this.rows_absence = temp; 
      
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }

   @ViewChild('suppressionDialog_absence', { static: true }) suppressionDialog_absence:TemplateRef<any>;
   @ViewChild('avertissementDialog_absence', { static: true }) avertissementDialog_absence:TemplateRef<any>;
  ngOnInit(): void {
  }
  onSelect_absence({ selected }) {
    
    if (selected) {
      this.index_selected_absence = this.rows_absence.indexOf(selected[0]) ;      
      this.currentItem_absence  = JSON.parse(JSON.stringify(selected[0]));
    }
    
  }
  ajouter_absence()
  {

    this.new_item_absence = true ;
    let item = 
    {
      id:'0',
      personnel_absent:{id: this.userConnecte.id_pers, nom:this.currentpersonnel.nom},
      type:null,
      motif:null,
      date_debut:null,
      date_fin:null,
      duree:null,
      validation:0
    } ;

    this.rows_absence.unshift(item);
    
    this.index_selected_absence = 0;
    
    if (this.item_selected_absence.length > 0) {
      this.item_selected_absence[0] = item;
    }
    else 
    {
      this.item_selected_absence.push(item);
    }
    this.editing_absence[0] = true;
   console.log(this.item_selected_absence);
   this.rows_absence = [...this.rows_absence];
    
  }
  modifier_absence()
  {
    this.editing_absence[this.index_selected_absence] = true;  
    this.new_item_absence = false ;
  }

  annuler_absence()
  {
    
    this.editing_absence[this.index_selected_absence] = false;
    this.item_selected_absence = [];
    if (this.new_item_absence ) 
    {
      this.new_item_absence = false;
      this.rows_absence.shift();
      this.rows_absence = [...this.rows_absence];
      this.all_absence = [...this.rows_absence];
    }else
    {
      this.rows_absence[this.index_selected_absence]=this.currentItem_absence;      
      this.rows_absence = [...this.rows_absence];
    }
  }
  
  supprimer_absence()
  {
    this.dialog.open(this.suppressionDialog_absence, { disableClose: true });
  }
  suppressionConfirmer_absence()
  {
    this.save_in_base_absence(1);
  }
  closeDialog()
  {
    this.dialog.closeAll();
  }
  verification_avant_save(etat_suppression)
  {
    var msg={
              titre:"AVERTISSEMENT",
              corps: "Ces dates existent dans time sheet"
            };
    this.index_api.getgeneralise('Timesheet_entete',"?menu=getfeuilletempsbydate_debu_fin&id_personnel="
    +this.userConnecte.id_pers+"&date_debut="+this.datepipe.transform(new Date(this.item_selected_absence[0].date_debut), 'yyyy-MM-dd')
    +"&date_fin="+this.datepipe.transform(new Date(this.item_selected_absence[0].date_fin), 'yyyy-MM-dd')).subscribe((resp) =>
    {  
      console.log(resp.response);
      if (resp.response.length!=0)
      {
        this.dialog.open(this.avertissementDialog_absence, { disableClose: true,data: msg });        
      }
      else
      {
        this.save_in_base_absence(etat_suppression);
      }
          
    });
  }
  
  save_in_base_absence(etat_suppression)
  {
    

    this.editing_absence[this.index_selected_absence] = false;
    

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    let data =
    {
      id: this.item_selected_absence[0].id,
      supprimer: etat_suppression,
      type: this.item_selected_absence[0].type,
      motif: this.item_selected_absence[0].motif,
      date_debut: this.datepipe.transform(new Date(this.item_selected_absence[0].date_debut), 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(new Date(this.item_selected_absence[0].date_fin), 'yyyy-MM-dd'),
      duree: this.item_selected_absence[0].duree,
      id_personnel_absent: this.item_selected_absence[0].personnel_absent.id,
      validation: this.item_selected_absence[0].validation
    }
  console.log(data);
    this.index_api.add('Absence', this.convertion_data(data), config).subscribe((response) => {
     

      if (!this.new_item_absence) 
      {
        if (etat_suppression == 1) 
        {
          this.all_absence.splice(this.index_selected_absence, 1);
          this.all_absence = [...this.all_absence];
          this.rows_absence = [...this.all_absence];
          
        }
      }
      else
      {
        this.new_item_absence = false;
        this.rows_absence[this.index_selected_absence]['id'] = String(response['response']);
        this.all_absence = [...this.rows_absence];
      }

      this.item_selected_absence = [];
      this.dialog.closeAll();
    }, error => {
      alert("erreur");
    });
    
    
  }
  valider_absence(etat_suppression)
  {
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    let data =
    {
      id: this.item_selected_absence[0].id,
      supprimer: etat_suppression,
      type: this.item_selected_absence[0].type,
      motif: this.item_selected_absence[0].motif,
      date_debut: this.datepipe.transform(new Date(this.item_selected_absence[0].date_debut), 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(new Date(this.item_selected_absence[0].date_fin), 'yyyy-MM-dd'),
      duree: this.item_selected_absence[0].duree,
      id_personnel_absent: this.item_selected_absence[0].personnel_absent.id,
      id_personnel_validation: this.userConnecte.id_pers,
      validation: 1
    }
  console.log(data);
    this.index_api.add('Absence', this.convertion_data(data), config).subscribe((response) => {
     
      this.rows_absence[this.index_selected_absence]['personnel_validation'] = {id: this.userConnecte.id_pers, nom: this.currentpersonnel.nom};
      this.rows_absence[this.index_selected_absence]['validation'] =1;
      this.all_absence = [...this.rows_absence];

      this.item_selected_absence = [];
    }, error => {
      alert("erreur");
    });
    
    
  }
  rejeter_absence(etat_suppression)
  {
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    let data =
    {
      id: this.item_selected_absence[0].id,
      supprimer: etat_suppression,
      type: this.item_selected_absence[0].type,
      motif: this.item_selected_absence[0].motif,
      date_debut: this.datepipe.transform(new Date(this.item_selected_absence[0].date_debut), 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(new Date(this.item_selected_absence[0].date_fin), 'yyyy-MM-dd'),
      duree: this.item_selected_absence[0].duree,
      id_personnel_absent: this.item_selected_absence[0].personnel_absent.id,
      id_personnel_validation: this.userConnecte.id_pers,
      validation: 2
    }
  console.log(data);
    this.index_api.add('Absence', this.convertion_data(data), config).subscribe((response) => {
     
      this.rows_absence[this.index_selected_absence]['personnel_validation'] = {id: this.userConnecte.id_pers, nom: this.currentpersonnel.nom};
      this.rows_absence[this.index_selected_absence]['validation'] =2;
      this.all_absence = [...this.rows_absence];

      this.item_selected_absence = [];
    }, error => {
      alert("erreur");
    });
    
    
  }

  updateValue_absence(e,c,i)
  {console.log(e);
    this.rows_absence[i][c] = e.target.value;
    
    //console.log(this.rows_absence[i][c]);
  }
  
  updateValue_absence_duree(e,c,i)
  {console.log(e);
    this.rows_absence[i][c] = e.target.value;
    let date_d=new Date(this.rows_absence[i]['date_debut']);
    console.log(date_d);
    let datef= new Date(date_d.getTime() + (parseFloat(e.target.value)*60*60000));
    console.log(datef);
    this.rows_absence[i]['date_fin'] = datef;
    //console.log(this.rows_absence[i][c]);
  }
  
  updateValue_absence_type(e,c,i)
  {console.log(e);
    this.rows_absence[i][c] = e.value;
    
    //console.log(this.rows_absence[i][c]);
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
    //console.log(this.rows_absence[i][c]);
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
