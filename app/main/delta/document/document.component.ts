import { Component, OnInit , TemplateRef,ViewChild} from '@angular/core';
import { AuthenticationService } from '../../../_services/authentification.service';
import { IndexApiService } from '../../../_services/index-api.service';
import {MatDialog} from '@angular/material/dialog';
import { ConstantService } from '../../../_services/constant.service';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentComponent implements OnInit
{
  all_document : any[];
  rows_document : any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  item_selected = [];
  editing = {};
  new_item : boolean;
  index_selected : number;  
  currentItem : any;
  userConnecte: any;
  fileToUpload: File = null;
  all_utilisateur : any[];

  
  loadingIndicator_client: boolean;
  reorderable_client: boolean;
  all_client : any[];
  rows_client : any[];
  
  loadingIndicator_mission: boolean;
  reorderable_mission: boolean;
  all_mission : any[];
  rows_mission : any[];
  all_sous_tache : any[];
  
  item_selected_client = [];
  item_selected_mission = [];

  all_link : any[];
  
  tabindex:any;
  all_document_commentaire : any[];
  rows_document_commentaire : any[];
  loadingIndicator_commentaire: boolean;
  reorderable_commentaire: boolean;
  item_selected_commentaire = [];
  editing_commentaire = {};
  new_item_commentaire : boolean;
  index_selected_commentaire : number;  
  currentItem_commentaire : any;

  
  all_document_type : any[];
  rows_document_type  : any[];
  loadingIndicator_document_type: boolean;
  reorderable_document_type: boolean;
  item_selected_document_type = [];
  editing_document_type = {};
  new_item_document_type : boolean;
  index_selected_document_type : number;  
  currentItem_document_type : any;
  fileToUpload_document_type: File = null;
  constructor(private authenticationservice: AuthenticationService,private index_api: IndexApiService,public dialog: MatDialog,private constant_service: ConstantService,private http: HttpClient)
  { 
    // Set the private defaults
    this.reorderable      = true;
    this.loadingIndicator = true;
    this.new_item = false ;
    this.rows_document = [];

    
    // Set the private defaults
    this.reorderable_client      = true;
    this.loadingIndicator_client = true;
    // Set the private defaults
    this.reorderable_mission      = true;
    this.loadingIndicator_mission = true;

    this.reorderable_commentaire      = true;
    this.loadingIndicator_commentaire = true;
    this.new_item_commentaire = false ;
    this.rows_document_commentaire = [];

    // Set the private defaults
    this.reorderable_document_type      = true;
    this.loadingIndicator_document_type = true;
    this.new_item_document_type = false ;
    this.rows_document_type = [];
    if (this.authenticationservice.currentUserValue)
    {
      this.userConnecte = this.authenticationservice.currentUserValue; 
    }
    if(this.userConnecte)
    {
      this.index_api.getgeneralise("Utilisateurs","?type_get=findAll").subscribe(resp =>
        {
          this.all_utilisateur = [...resp.response];
          console.log(this.all_utilisateur);    
        });
      this.index_api.getgeneralise("Document","?menu=getallsous_tache").subscribe(resp =>
      {
        this.all_sous_tache = [...resp.response];
        console.log(this.all_sous_tache);    
      });
    }
    
  }
  updateFilter_client(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","nom_client","adresse","telephone",];
    
 
    if (val == "") 
    {
      this.rows_client = this.all_client;
    }
    else 
    {
      // filter our data
      const temp = this.all_client.filter(function (d) {
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
      this.rows_client = temp;       
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }
  
  onSelect_client({ selected }) {
    
    if (selected)
    {     
      this.index_api.getgeneralise("Mission","?menu=getmissionbyclient&id_client="+selected[0].id).subscribe(resp =>
      {
        this.all_mission = [...resp.response];
        this.rows_mission = resp.response;
        this.item_selected_mission=[];
        console.log(this.rows_mission);
      });       
    }
    
  }
  updateFilter_mission(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","code","libelle","chef_mission.nom",];
    
 
    if (val == "") 
    {
      this.rows_mission = this.all_mission;
    }
    else 
    {
      // filter our data
      const temp = this.all_mission.filter(function (d) {
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
      this.rows_mission = temp;       
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }
  
  onSelect_mission({ selected }) {
    
    if (selected)
    {   
      this.item_selected=[];
      this.index_api.getgeneralise("Document","?menu=getdocumentBymission&id_mission="+selected[0].id ).subscribe(resp =>
      {
        this.all_document = [...resp.response];
        this.rows_document = resp.response;
        console.log(this.rows_document);    
      }); 
         
    }
    
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","mission.libelle","description","prepare_par.nom","date_preparation","repertoire"];
    
 
    if (val == "") 
    {
      this.rows_document = this.all_document;
    }
    else 
    {
      // filter our data
      const temp = this.all_document.filter(function (d) {
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
      this.rows_document = temp;       
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }
  @ViewChild('suppressionDialog_document_type', { static: true }) suppressionDialog_document_type:TemplateRef<any>;
  @ViewChild('suppressionDialog', { static: true }) suppressionDialog:TemplateRef<any>;
  @ViewChild('suppressionDialog_commentaire', { static: true }) suppressionDialog_commentaire:TemplateRef<any>;
  ngOnInit(): void
  {   
      this.tabindex=0;
      this.index_api.getAll("client").subscribe(resp =>
      {
        this.all_client = [...resp.response];
        this.rows_client = resp.response;   
      });
  }
  tabClick(tab)
  {
    if (tab.index==0)
    {
      this.item_selected = [];
      this.index_api.getgeneralise("Document","?menu=getdocumentBymission&id_mission="+this.item_selected_mission[0].id ).subscribe(resp =>
        {
          this.all_document = [...resp.response];
          this.rows_document = [...resp.response];
          
          console.log(this.rows_document);    
        });
    }
    if (tab.index==1)
    {
      this.index_api.getgeneralise("Historique_doc","?menu=gethistoriqueBydocument&id_document="+this.item_selected[0].id ).subscribe(resp =>
        {
          this.all_document_commentaire = [...resp.response];
          this.rows_document_commentaire = resp.response;
          console.log(this.rows_document_commentaire);    
        });
    }
    if (tab.index==3)
    {
      this.item_selected_document_type = [];
      this.index_api.getgeneralise("Document_type","?menu=getdocument_typeBymission&id_mission="+this.item_selected_mission[0].id ).subscribe(resp =>
        {
          this.all_document_type = [...resp.response];
          this.rows_document_type = [...resp.response];
          
          console.log(this.rows_document_type);    
        });
    }
  }
  onSelect({ selected }) {
    
    if (selected)
    {
      this.index_selected = this.rows_document.indexOf(selected[0]) ;
    
      if (!this.editing[this.index_selected])
      {
        this.currentItem  = JSON.parse(JSON.stringify(selected[0]));        
      }
      console.log(selected[0]);       
    }
    
  }
  ajouter()
  {

    this.new_item = true ;
    let item = 
    {
      id:'0',
      description:'',
      prepare_par:{id: null, nom:''},
      date_preparation:'',
      date_insertion:this.convertionDate(new Date()),
      id_link_mere:null,
      type_link:null,
      type_document:null,
      sous_tache:{ id: null, libelle:''},
      link:{ id: null, description:''},
      repertoire: null,
      utilisateur:{id: this.userConnecte.id, nom: this.userConnecte.nom}
    } ;

    this.rows_document.unshift(item);

    this.rows_document = [...this.rows_document];
    
    this.editing[0] = true;
    this.index_selected = 0;
    
    if (this.item_selected.length > 0) {
      this.item_selected[0] = item;
    }
    else 
    {
      this.item_selected.push(item);
    }
    
  }
  modifier() {
    this.editing[this.index_selected] = true;
    var idd=this.item_selected[0].id; 
    this.all_link= this.all_document.filter(function(obj) {

      return obj.id != idd;
    });
    console.log(this.editing); 
  }

  annuler()
  {
    
    this.editing[this.index_selected] = false;
    this.item_selected = [];
    if (this.new_item ) 
    {
      this.new_item = false;
      this.rows_document.shift();
      this.rows_document = [...this.rows_document];
      this.all_document = [...this.rows_document];
    }else
    {
      this.rows_document[this.index_selected]=this.currentItem;      
      this.rows_document = [...this.rows_document];
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
    var repertory = this.item_selected[0].repertoire;

    if(this.fileToUpload)
    {    
      var file= this.fileToUpload;
      
      this.index_api.getgeneralise("Document","?menu=getmaxiddocument").subscribe(resp =>
      {       
        var id_max_base= resp.response;
        console.log(id_max_base); 
        var id_max = parseInt(this.item_selected[0].id);
        if (this.new_item==true)
        {
          if (id_max_base[0].id)
          {
            id_max= parseInt(id_max_base[0].id) + 1;
          }
          else
          {
            id_max=1;
          }  
        }
             
            var name_file =id_max+'_'+file.name ;      
            var repertoire = 'document/';
            var name_replace = String(this.fileToUpload.name).replace(' ','_').replace('\'','_');
            repertory = repertoire+id_max+'_'+name_replace;
            this.item_selected[0].repertoire = repertory;
            var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/save_upload_file";
            var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
      
                var lin = null;
                if (this.item_selected[0].link)
                {
                  if (this.item_selected[0].link.length!=0)
                  {
                    lin = this.item_selected[0].link.id
                  }
                }
                let data =
                  {
                    id: this.item_selected[0].id,
                    supprimer: etat_suppression,
                    description         : this.item_selected[0].description,
                    prepare_par     : this.item_selected[0].prepare_par.id,
                    id_utilisateur  : this.item_selected[0].utilisateur.id,
                    id_sous_tache      : this.item_selected[0].sous_tache.id,
                    id_link_mere      : lin,
                    type_link      : this.item_selected[0].type_link,
                    type_document      : this.item_selected[0].type_document,
                    date_preparation: this.convertionDate(this.item_selected[0].date_preparation),
                    repertoire      : repertory,
                    id_mission      : this.item_selected_mission[0].id
                    
                  }
           
      
        console.log(data);
            
            var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
            {console.log(reponse_file);
                if(reponse_file['erreur'])
                {
                  
                  this.new_item = false;               
                }
                else
                {
                  this.index_api.add('document', this.convertion_data(data), config).subscribe((response) =>
                  {
                    
      
                    if (!this.new_item) 
                    {
                      if (etat_suppression == 1) 
                      {
                        this.all_document.splice(this.index_selected, 1);
                        this.all_document = [...this.all_document];
                        this.rows_document = [...this.all_document];                        
                      }
                      else
                      {
                        if (repertory!=this.currentItem.repertoire)
                        {
                          var chemin= this.currentItem.repertoire;
                          var fd = new FormData();
                              fd.append('chemin',chemin);

                          var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/remove_upload_file";
                          var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
                          {
                          },
                          (erreur) =>
                          {                    
                            console.log(erreur); 
                          });
                        }
                        
                      }
                    }
                    else
                    {
                      this.new_item = false;
                      this.rows_document[this.index_selected]['id'] = String(response['response']);
                      this.all_document = [...this.rows_document];
                    }
                    
                    this.fileToUpload = null;
                    this.item_selected = [];
                    this.dialog.closeAll();
                    this.new_item = false; 
                  }, error => {
                    //alert("erreur") 
                    this.new_item = false;                    
                    this.fileToUpload = null;
                  });
                }
            },
            (erreur) =>
            {                    
              console.log('erreur');              
              this.fileToUpload = null; 
            }); 
      });
          
        
    }
    else
    {
        var lin = null;
        if (this.item_selected[0].link)
        {
          if (this.item_selected[0].link.length!=0)
          {
            lin = this.item_selected[0].link.id
          }
        }
        let data =
          {
            id: this.item_selected[0].id,
            supprimer: etat_suppression,
            description         : this.item_selected[0].description,
            prepare_par     : this.item_selected[0].prepare_par.id,
            id_utilisateur  : this.item_selected[0].utilisateur.id,
            id_sous_tache      : this.item_selected[0].sous_tache.id,
            id_link_mere      : lin,
            type_link      : this.item_selected[0].type_link,
            type_document      : this.item_selected[0].type_document,
            date_preparation: this.convertionDate(this.item_selected[0].date_preparation),
            repertoire      : repertory,
            id_mission      : this.item_selected_mission[0].id
            
          }

    console.log(data);
      this.index_api.add('document', this.convertion_data(data), config).subscribe((response) =>
      {
        if (!this.new_item) 
        {
          if (etat_suppression == 1) 
          { 
            this.all_document.splice(this.index_selected, 1);
            this.all_document = [...this.all_document];
            this.rows_document = [...this.all_document];
            var chemin= String(this.item_selected[0].repertoire);
            var fd = new FormData();
                fd.append('chemin',chemin);

                console.log(chemin);
            var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/remove_upload_file";
            var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
            {
            },
            (erreur) =>
            { 
            });
          }
        }
        /*else
        {
          this.new_item = false;
          this.rows_document[this.index_selected]['id'] = String(response['response']);
          this.all_document = [...this.rows_document];
        }*/
        
        this.fileToUpload = null;
        this.item_selected = [];
        this.new_item = false; 
        this.dialog.closeAll();
      }, error => {
        //alert("erreur");
        this.new_item = false;        
        this.fileToUpload = null;
      });

    }   
    
  }
  onclick_download(file)
  {
    window.open(this.constant_service.apiUrlFile + file);
  }

  updateValue(e,c,i)
  {
    if (e.target.value)
    {      
      this.rows_document[i][c] = e.target.value;
    }
    else
    {
      this.rows_document[i][c] = null
    }
  }
  supprimer()
  {
    this.dialog.open(this.suppressionDialog, { disableClose: true });
  }
  suppressionConfirmer()
  {
    this.save_in_base(1);
  }

  updateValue_select_prepare_par(e,c,i)
  {
    var util= this.all_utilisateur.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_document[i][c] = {id: String(e.value),nom: util[0].nom};
    console.log(util);
    console.log(this.rows_document);
  }
  updateValue_select_sous_tache(e,c,i)
  {    
    var mis= this.all_sous_tache.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_document[i][c] = {id: String(e.value),libelle: mis[0].libelle};
  }
  updateValue_repertoire(files: FileList,c,i)
  {
    this.fileToUpload = files.item(0);
    //this.data = {repertoire: files.item(0).name};
    //this.documentForm.patchValue({repertoire:files.item(0).name})
    this.item_selected[0].repertoire=files.item(0).name;
  }
  updateValue_select_type_link(e,c,i)
  {console.log(this.item_selected);
    var idd= this.item_selected[0].id;
    this.all_link= this.all_document.filter(function(obj) {
      console.log(idd);
      return obj.id != idd;
    });
    this.rows_document[i][c] = e.value;
    this.item_selected[0].link = {id:null,description:''}
  }
  updateValue_select_link(e,c,i)
  {
    var link= this.all_document.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_document[i][c] = {id: String(e.value),description: link[0].description};
  }
  affichage_link(link)
  {
    var lin="Normal"
    if (parseInt(link)==2)
    {
     lin= "Master"; 
    }
    return lin;
  }
  updateValue_select_type_document(e,c,i)
  {
    this.rows_document[i][c] = e.value;
  }
  affichage_document(docu)
  {
    var doc="Provisoire"
    if (parseInt(docu)==2)
    {
     doc= "Définitif"; 
    }
    return doc;
  }
  
  updateFilter_commentaire(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","observation","date_histoire","utilisateur.nom"];
    
 
    if (val == "") 
    {
      this.rows_document_commentaire = this.all_document_commentaire;
    }
    else 
    {
      // filter our data
      const temp = this.all_document_commentaire.filter(function (d) {
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
      this.rows_document_commentaire = temp;  
    }
  }
  onSelect_commentaire({ selected }) {
    
    if (selected) {
      this.index_selected_commentaire = this.rows_document_commentaire.indexOf(selected[0]) ;      
      this.currentItem_commentaire  = JSON.parse(JSON.stringify(selected[0]));
    }
    
  }
  ajouter_commentaire()
  {

    this.new_item_commentaire = true ;
    let item = 
    {
      id:'0',
      //type_histoire:null,
      observation:null,
      date_histoire:this.convertionDate(new Date()),
      id_document:this.item_selected[0].id,
      utilisateur:{id: this.userConnecte.id, nom:this.userConnecte.nom}
    } ;

    this.rows_document_commentaire.unshift(item);
    
    this.index_selected_commentaire = 0;
    
    if (this.item_selected_commentaire.length > 0) {
      this.item_selected_commentaire[0] = item;
    }
    else 
    {
      this.item_selected_commentaire.push(item);
    }
    this.editing_commentaire[0] = true;
   console.log(this.item_selected_commentaire);
   this.rows_document_commentaire = [...this.rows_document_commentaire];
    
  }
  modifier_commentaire()
  {
    this.editing_commentaire[this.index_selected_commentaire] = true; 
    this.new_item_commentaire = false ;
  
  }

  annuler_commentaire()
  {
    
    this.editing_commentaire[this.index_selected_commentaire] = false;
    this.item_selected_commentaire = [];
    if (this.new_item_commentaire ) 
    {
      this.new_item_commentaire = false;
      this.rows_document_commentaire.shift();
      this.rows_document_commentaire = [...this.rows_document_commentaire];
      this.all_document_commentaire = [...this.rows_document_commentaire];
    }else
    {
      this.rows_document_commentaire[this.index_selected]=this.currentItem_commentaire;      
      this.rows_document_commentaire = [...this.rows_document_commentaire];
    }
  }
  
  save_in_base_commentaire(etat_suppression)
  {
    

    this.editing_commentaire[this.index_selected_commentaire] = false;
    

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    let data =
    {
      id: this.item_selected_commentaire[0].id,
      supprimer: etat_suppression,
      //type_histoire: this.item_selected_commentaire[0].type_histoire,
      observation:this.item_selected_commentaire[0].observation,
      date_histoire: this.item_selected_commentaire[0].date_histoire,
      id_document:this.item_selected_commentaire[0].id_document,
      id_utilisateur:this.item_selected_commentaire[0].utilisateur.id
    }
    console.log(this.item_selected_commentaire[0]);
  console.log(data);
    this.index_api.add('historique_doc', this.convertion_data(data), config).subscribe((response) => {
     

      if (!this.new_item_commentaire) 
      {
        if (etat_suppression == 1) 
        {
          this.all_document_commentaire.splice(this.index_selected_commentaire, 1);
          this.all_document_commentaire = [...this.all_document_commentaire];
          this.rows_document_commentaire = [...this.all_document_commentaire];
          
        }
      }
      else
      {
        this.new_item_commentaire = false;
        this.rows_document_commentaire[this.index_selected_commentaire]['id'] = String(response['response']);
        this.all_document_commentaire = [...this.rows_document_commentaire];
      }

      this.item_selected_commentaire = [];
      this.dialog.closeAll();
    }, error => {
      alert("erreur");
    });
    
    
  }

  updateValue_commentaire(e,c,i)
  {
    if (e.target.value)
    {     
      this.rows_document_commentaire[i][c] = e.target.value;
      this.rows_document_commentaire = [...this.rows_document_commentaire];
    }
    else
    {      
      this.rows_document_commentaire[i][c] = null;
      this.rows_document_commentaire = [...this.rows_document_commentaire];
    }
    //console.log(this.rows_document_commentaire[i][c]);
    console.log(this.item_selected_commentaire[0]);
  }
  

  supprimer_commentaire()
  {
    this.dialog.open(this.suppressionDialog_commentaire, { disableClose: true });
  }
  suppressionConfirmer_commentaire()
  {
    this.save_in_base_commentaire(1);
  }
  closeDialog()
  {
    this.dialog.closeAll();
  }

  
  updateFilter_document_type(event) {
    const val = event.target.value.toLowerCase();
    
     let ent = ["id","description","prepare_par.nom","date_preparation","repertoire"];
    
 
    if (val == "") 
    {
      this.rows_document_type = this.all_document_type;
    }
    else 
    {
      // filter our data
      const temp = this.all_document_type.filter(function (d) {
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
      this.rows_document_type = temp;       
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    }
  }
  
  
  onSelect_document_type({ selected }) {
    
    if (selected)
    {
      this.index_selected_document_type = this.rows_document_type.indexOf(selected[0]) ;
    
      if (!this.editing_document_type[this.index_selected_document_type])
      {
        this.currentItem_document_type  = JSON.parse(JSON.stringify(selected[0]));        
      }
      console.log(selected[0]);       
    }
    
  }
  ajouter_document_type()
  {

    this.new_item_document_type = true ;
    let item = 
    {
      id:'0',
      description:'',
      prepare_par:{id: null, nom:''},
      date_preparation:'',
      date_insertion:this.convertionDate(new Date()),
      repertoire: null,
      utilisateur:{id: this.userConnecte.id, nom: this.userConnecte.nom}
    } ;

    this.rows_document_type.unshift(item);

    this.rows_document_type = [...this.rows_document_type];
    
    this.editing_document_type[0] = true;
    this.index_selected_document_type = 0;
    
    if (this.item_selected_document_type.length > 0) {
      this.item_selected_document_type[0] = item;
    }
    else 
    {
      this.item_selected_document_type.push(item);
    }
    
  }
  modifier_document_type() {
    this.editing_document_type[this.index_selected_document_type] = true; 
  }

  annuler_document_type()
  {
    
    this.editing_document_type[this.index_selected_document_type] = false;
    this.item_selected_document_type = [];
    if (this.new_item_document_type ) 
    {
      this.new_item_document_type = false;
      this.rows_document_type.shift();
      this.rows_document_type = [...this.rows_document_type];
      this.all_document_type = [...this.rows_document_type];
    }else
    {
      this.rows_document_type[this.index_selected_document_type]=this.currentItem_document_type;      
      this.rows_document_type = [...this.rows_document_type];
    }
  }
  

  save_in_base_document_type(etat_suppression)
  {
    this.editing_document_type[this.index_selected_document_type] = false;
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    var repertory = this.item_selected_document_type[0].repertoire;

    if(this.fileToUpload_document_type)
    {    
      var file= this.fileToUpload_document_type;
      
      this.index_api.getgeneralise("Document_type","?menu=getmaxid_document_type").subscribe(resp =>
      {       
        var id_max_base= resp.response;
        console.log(id_max_base); 
        var id_max = parseInt(this.item_selected_document_type[0].id);
        if (this.new_item_document_type==true)
        {
          if (id_max_base[0].id)
          {
            id_max= parseInt(id_max_base[0].id) + 1;
          }
          else
          {
            id_max=1;
          }  
        }
             
            var name_file =id_max+'_'+file.name ;      
            var repertoire = 'document_type/';
            var name_replace = String(this.fileToUpload_document_type.name).replace(' ','_').replace('\'','_');
            repertory = repertoire+id_max+'_'+name_replace;
            this.item_selected_document_type[0].repertoire = repertory;
            var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/save_upload_file";
            var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
      
                let data =
                  {
                    id: this.item_selected_document_type[0].id,
                    supprimer: etat_suppression,
                    description         : this.item_selected_document_type[0].description,
                    prepare_par     : this.item_selected_document_type[0].prepare_par.id,
                    id_utilisateur  : this.item_selected_document_type[0].utilisateur.id,
                    date_preparation: this.convertionDate(this.item_selected_document_type[0].date_preparation),
                    repertoire      : repertory,
                    id_mission      : this.item_selected_mission[0].id
                    
                  }
           
      
        console.log(data);
            
            var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
            {console.log(reponse_file);
                if(reponse_file['erreur'])
                {
                  
                  this.new_item_document_type = false;               
                }
                else
                {
                  this.index_api.add('document_type', this.convertion_data(data), config).subscribe((response) =>
                  {
                    
      
                    if (!this.new_item_document_type) 
                    {
                      if (etat_suppression == 1) 
                      {
                        this.all_document_type.splice(this.index_selected_document_type, 1);
                        this.all_document_type = [...this.all_document_type];
                        this.rows_document_type = [...this.all_document_type];                        
                      }
                      else
                      {
                        if (repertory!=this.currentItem_document_type.repertoire)
                        {
                          var chemin= this.currentItem_document_type.repertoire;
                          var fd = new FormData();
                              fd.append('chemin',chemin);

                          var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/remove_upload_file";
                          var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
                          {
                          },
                          (erreur) =>
                          {                    
                            console.log(erreur); 
                          });
                        }
                      }
                    }
                    else
                    {
                      this.new_item_document_type = false;
                      this.rows_document_type[this.index_selected_document_type]['id'] = String(response['response']);
                      this.all_document_type = [...this.rows_document_type];
                    }
                    
                    this.fileToUpload_document_type = null;
                    this.item_selected_document_type = [];
                    this.dialog.closeAll();
                  }, error => {
                    //alert("erreur")                    
                    this.fileToUpload_document_type = null;
                  });
                }
            },
            (erreur) =>
            {                    
              console.log('erreur');              
              this.fileToUpload_document_type = null; 
            }); 
      });
          
        
    }
    else
    {
        let data =
          {
            id: this.item_selected_document_type[0].id,
            supprimer: etat_suppression,
            description         : this.item_selected_document_type[0].description,
            prepare_par     : this.item_selected_document_type[0].prepare_par.id,
            id_utilisateur  : this.item_selected_document_type[0].utilisateur.id,
            date_preparation: this.convertionDate(this.item_selected_document_type[0].date_preparation),
            repertoire      : repertory,
            id_mission      : this.item_selected_mission[0].id
            
          }

    console.log(data);
      this.index_api.add('document_type', this.convertion_data(data), config).subscribe((response) =>
      {
        if (!this.new_item_document_type) 
        {
          if (etat_suppression == 1) 
          { 
            this.all_document_type.splice(this.index_selected_document_type, 1);
            this.all_document_type = [...this.all_document_type];
            this.rows_document_type = [...this.all_document_type];
            var chemin= String(this.item_selected_document_type[0].repertoire);
            var fd = new FormData();
                fd.append('chemin',chemin);

                console.log(chemin);
            var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/remove_upload_file";
            var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
            {
            },
            (erreur) =>
            { 
            });
          }
        }
        /*else
        {
          this.new_item = false;
          this.rows_document[this.index_selected]['id'] = String(response['response']);
          this.all_document = [...this.rows_document];
        }*/
        
        this.fileToUpload_document_type = null;
        this.item_selected_document_type = [];
        this.dialog.closeAll();
      }, error => {
        //alert("erreur");
        this.new_item_document_type = false;        
        this.fileToUpload_document_type = null;
      });

    }   
    
  }
  onclick_download_document_type(file)
  {
    window.open(this.constant_service.apiUrlFile + file);
  }

  updateValue_document_type(e,c,i)
  {
    if (e.target.value)
    {
      this.rows_document_type[i][c] = e.target.value;
      
    }
    else
    {
      this.rows_document_type[i][c] = null;
    }
  }
  supprimer_document_type()
  {
    this.dialog.open(this.suppressionDialog_document_type, { disableClose: true });
  }
  suppressionConfirmer_document_type()
  {
    this.save_in_base_document_type(1);
  }

  updateValue_document_type_select_prepare_par(e,c,i)
  {
    var util= this.all_utilisateur.filter(function(obj) {

      return obj.id == e.value;
    });
    this.rows_document_type[i][c] = {id: String(e.value),nom: util[0].nom};
    console.log(util);
    console.log(this.rows_document_type);
  }
  updateValue_document_type_repertoire(files: FileList,c,i)
  {
    this.fileToUpload_document_type = files.item(0);
    //this.data = {repertoire: files.item(0).name};
    //this.documentForm.patchValue({repertoire:files.item(0).name})
    this.item_selected_document_type[0].repertoire=files.item(0).name;
  }
  updateValue_document_type_select_type_document(e,c,i)
  {
    this.rows_document_type[i][c] = e.value;
  }
 
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
