import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentification.service';
import { IndexApiService } from '../../../_services/index-api.service';
import {MatDialog} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.scss']
})
export class CongeComponent implements OnInit
{
  
  all_conge : any[];
  rows_conge : any[];
  loadingIndicator_conge: boolean;
  reorderable_conge: boolean;
  item_selected_conge = [];
  editing_conge = {};
  new_item_conge : boolean;
  index_selected_conge : number;  
  currentItem_conge : any;
  userConnecte: any;
  currentpersonnel: any;
  constructor(private authenticationservice: AuthenticationService,private index_api: IndexApiService,public dialog: MatDialog,public datepipe: DatePipe)
  {
    // Set the private defaults
    this.reorderable_conge      = true;
    this.loadingIndicator_conge = true;
    this.new_item_conge = false ;
    this.rows_conge = [];
    if (this.authenticationservice.currentUserValue)
    {
      this.userConnecte = this.authenticationservice.currentUserValue; 
      if (this.userConnecte)
      { 
        this.index_api.getgeneralise('timesheet_entete',"?menu=get_personel&id_personnel="+this.userConnecte.id_pers).subscribe((resp) =>
        {      
          this.currentpersonnel = resp.response;
        });
        this.index_api.getgeneralise('conge',"?menu=getcongebypersonnel&id_personnel_conge="+this.userConnecte.id_pers).subscribe((resp) =>
        {      
          this.rows_conge = resp.response;
          this.all_conge = [...resp.response];
          console.log(this.rows_conge);
        });
      }
    }
   }
   updateFilter_conge(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","motif","date_debut","date_fin","date_retour","validation","personnel_conge.nom"];
    
 
    if (val == "") 
    {
      this.rows_conge = this.all_conge;

    }
    else 
    {
      // filter our data
      const temp = this.all_conge.filter(function (d) {
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
      this.rows_conge = temp; 
      
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }

   @ViewChild('suppressionDialog_conge', { static: true }) suppressionDialog_conge:TemplateRef<any>;
   @ViewChild('avertissementDialog_conge', { static: true }) avertissementDialog_conge:TemplateRef<any>;

  ngOnInit(): void {
  }
  
  onSelect_conge({ selected }) {
    
    if (selected) {
      this.index_selected_conge = this.rows_conge.indexOf(selected[0]) ;      
      this.currentItem_conge  = JSON.parse(JSON.stringify(selected[0]));
    }
    
  }
  ajouter_conge()
  {

    this.new_item_conge = true ;
    let item = 
    {
      id:'0',
      personnel_conge:{id: this.userConnecte.id_pers, nom:this.currentpersonnel.nom},
      motif:null,
      date_debut:null,
      date_fin:null,
      date_retour:null,
      reste_conge:0,
      validation:0
    } ;

    this.rows_conge.unshift(item);
    
    this.index_selected_conge = 0;
    
    if (this.item_selected_conge.length > 0) {
      this.item_selected_conge[0] = item;
    }
    else 
    {
      this.item_selected_conge.push(item);
    }
    this.editing_conge[0] = true;
   console.log(this.item_selected_conge);
   this.rows_conge = [...this.rows_conge];
    
  }
  modifier_conge()
  {
    this.editing_conge[this.index_selected_conge] = true;  
    this.new_item_conge = false ;
  }

  annuler_conge()
  {
    
    this.editing_conge[this.index_selected_conge] = false;
    this.item_selected_conge = [];
    if (this.new_item_conge ) 
    {
      this.new_item_conge = false;
      this.rows_conge.shift();
      this.rows_conge = [...this.rows_conge];
      this.all_conge = [...this.rows_conge];
    }else
    {
      this.rows_conge[this.index_selected_conge]=this.currentItem_conge;      
      this.rows_conge = [...this.rows_conge];
    }
  }
  
  supprimer_conge()
  {
    this.dialog.open(this.suppressionDialog_conge, { disableClose: true });
  }
  suppressionConfirmer_conge()
  {
    this.save_in_base_conge(1);
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
    +this.userConnecte.id_pers+"&date_debut="+this.datepipe.transform(new Date(this.item_selected_conge[0].date_debut), 'yyyy-MM-dd')
    +"&date_fin="+this.datepipe.transform(new Date(this.item_selected_conge[0].date_fin), 'yyyy-MM-dd')).subscribe((resp) =>
    {  
      console.log(resp.response);
      if (resp.response.length!=0)
      {
        this.dialog.open(this.avertissementDialog_conge, { disableClose: true,data: msg });        
      }
      else
      {
        this.save_in_base_conge(etat_suppression);
      }
          
    });
  }
  save_in_base_conge(etat_suppression)
  {
    

    this.editing_conge[this.index_selected_conge] = false;
    

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    var date_r='';
    if (this.item_selected_conge[0].date_retour) {
      date_r=this.datepipe.transform(new Date(this.item_selected_conge[0].date_retour), 'yyyy-MM-dd');
    }
    let data =
    {
      id: this.item_selected_conge[0].id,
      supprimer: etat_suppression,
      motif: this.item_selected_conge[0].motif,
      date_debut: this.datepipe.transform(new Date(this.item_selected_conge[0].date_debut), 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(new Date(this.item_selected_conge[0].date_fin), 'yyyy-MM-dd'),
      date_retour: date_r,
      id_personnel_conge: this.item_selected_conge[0].personnel_conge.id,
      validation: this.item_selected_conge[0].validation,
      reste_conge: this.item_selected_conge[0].reste_conge,
    }
  console.log(data);
    this.index_api.add('conge', this.convertion_data(data), config).subscribe((response) => {
     

      if (!this.new_item_conge) 
      {
        if (etat_suppression == 1) 
        {
          this.all_conge.splice(this.index_selected_conge, 1);
          this.all_conge = [...this.all_conge];
          this.rows_conge = [...this.all_conge];
          
        }
      }
      else
      {
        this.new_item_conge = false;
        this.rows_conge[this.index_selected_conge]['id'] = String(response['response']);
        this.all_conge = [...this.rows_conge];
      }

      this.item_selected_conge = [];
      this.dialog.closeAll();
    }, error => {
      alert("erreur");
    });
    
    
  }
  valider_conge(etat_suppression)
  {
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    var date_r='';
    if (this.item_selected_conge[0].date_retour) {
      date_r=this.datepipe.transform(new Date(this.item_selected_conge[0].date_retour), 'yyyy-MM-dd');
    }
    let data =
    {
      id: this.item_selected_conge[0].id,
      supprimer: etat_suppression,
      motif: this.item_selected_conge[0].motif,
      date_debut: this.datepipe.transform(new Date(this.item_selected_conge[0].date_debut), 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(new Date(this.item_selected_conge[0].date_fin), 'yyyy-MM-dd'),
      date_retour: date_r,
      id_personnel_conge: this.item_selected_conge[0].personnel_conge.id,
      id_personnel_validation: this.userConnecte.id_pers,
      validation: 1,
      reste_conge: this.item_selected_conge[0].reste_conge
    }
  console.log(data);
    this.index_api.add('conge', this.convertion_data(data), config).subscribe((response) => {
     
      this.rows_conge[this.index_selected_conge]['personnel_validation'] = {id: this.userConnecte.id_pers, nom: this.currentpersonnel.nom};
      this.rows_conge[this.index_selected_conge]['validation'] =1;
      this.all_conge = [...this.rows_conge];

      this.item_selected_conge = [];
    }, error => {
      alert("erreur");
    });
    
    
  }
  rejeter_conge(etat_suppression)
  {
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    var date_r='';
    if (this.item_selected_conge[0].date_retour) {
      date_r=this.datepipe.transform(new Date(this.item_selected_conge[0].date_retour), 'yyyy-MM-dd');
    }
    let data =
    {
      id: this.item_selected_conge[0].id,
      supprimer: etat_suppression,
      motif: this.item_selected_conge[0].motif,
      date_debut: this.datepipe.transform(new Date(this.item_selected_conge[0].date_debut), 'yyyy-MM-dd'),
      date_fin: this.datepipe.transform(new Date(this.item_selected_conge[0].date_fin), 'yyyy-MM-dd'),
      date_retour: date_r,
      id_personnel_conge: this.item_selected_conge[0].personnel_conge.id,
      id_personnel_validation: this.userConnecte.id_pers,
      validation: 2,
      reste_conge: this.item_selected_conge[0].reste_conge
    }
  console.log(data);
    this.index_api.add('conge', this.convertion_data(data), config).subscribe((response) => {
     
      this.rows_conge[this.index_selected_conge]['personnel_validation'] = {id: this.userConnecte.id_pers, nom: this.currentpersonnel.nom};
      this.rows_conge[this.index_selected_conge]['validation'] =2;
      this.all_conge = [...this.rows_conge];

      this.item_selected_conge = [];
    }, error => {
      alert("erreur");
    });
    
    
  }

  updateValue_conge(e,c,i)
  {console.log(e);
    this.rows_conge[i][c] = e.target.value;
    
    //console.log(this.rows_conge[i][c]);
  }
    
  updateValue_conge_date_debut(e,c,i)
  {console.log(e);    
    this.index_api.getgeneralise('conge',"?menu=testcongebydate_debut&id_personnel_conge="+this.userConnecte.id_pers+"&date_debut="+this.datepipe.transform(new Date(e.target.value), 'yyyy-MM-dd')).subscribe((resp) =>
    {      
          if (resp.response.length!=0)
          {
            console.log('misy');
            this.rows_conge[i][c] = null;
          }
          else
          {
            console.log('tsymisy');
            this.rows_conge[i][c] = e.target.value;
          }
    });
    //console.log(this.rows_conge[i][c]);
  }
  
  updateValue_conge_date_fin(e,c,i)
  {console.log(e); 
    var d1= this.datepipe.transform(new Date(this.item_selected_conge[0].date_debut), 'yyyy-MM-dd');
    var d2= this.datepipe.transform(new Date(e.target.value), 'yyyy-MM-dd');
    var endDate = new Date(d2);
    var startDate = new Date(d1);
  
    var Time = endDate.getTime() - startDate.getTime();
    var nbr_day= (Time / (1000 * 3600 * 24))+1;
    var anne_now=this.datepipe.transform(new Date(), 'yyyy') ; 
    this.index_api.getgeneralise('conge',"?menu=getmaxidcongevalidebypersonnel&id_personnel_conge="+this.userConnecte.id_pers+"&annee_now="+anne_now).subscribe((resp) =>
    {      
          if (resp.response.length!=0)
          {
            console.log('misy');
            this.rows_conge[i][c] = e.target.value;
            this.rows_conge[i]['reste_conge'] = parseFloat(resp.response[0].reste_conge)-nbr_day;
          }
          else
          {
            console.log('tsymisy');
            this.rows_conge[i][c] = e.target.value;
            this.rows_conge[i]['reste_conge'] = 31-nbr_day;
          }
    });
    //console.log(this.rows_conge[i][c]);
  }
  updateValue_conge_date_retour(e,c,i)
  {
    var d1= this.datepipe.transform(new Date(this.item_selected_conge[0].date_debut), 'yyyy-MM-dd');
    var d2= this.datepipe.transform(new Date(e.target.value), 'yyyy-MM-dd');
    var endDate = new Date(d2);
    var startDate = new Date(d1);
  
    var Time = endDate.getTime() - startDate.getTime();
    var nbr_day= (Time / (1000 * 3600 * 24))+1; 
    var anne_now=this.datepipe.transform(new Date(), 'yyyy') ;  
    this.index_api.getgeneralise('conge',"?menu=getmaxidcongevalidebypersonnel&id_personnel_conge="+this.userConnecte.id_pers+"&annee_now="+anne_now).subscribe((resp) =>
    {      console.log(resp.response);
          if (resp.response.length!=0)
          {
            console.log('misy');
            this.rows_conge[i][c] = e.target.value;
            this.rows_conge[i]['reste_conge'] = parseFloat(resp.response[0].reste_conge)-nbr_day;
          }
          else
          {
            console.log('tsymisy');
            this.rows_conge[i][c] = e.target.value;
            this.rows_conge[i]['reste_conge'] = 31-nbr_day;
          }
    });
    //console.log(this.rows_conge[i][c]);
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
    let affiche='conge';
    if (validation==2)
    {
      affiche='Maladie';
    }
    if (validation==3)
    {
      affiche='Pérmission';
    }
    return affiche;
    //console.log(this.rows_conge[i][c]);
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
