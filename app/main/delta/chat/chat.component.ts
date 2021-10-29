import { Component, OnInit,ViewEncapsulation , TemplateRef,ViewChild} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { IndexApiService } from '../../../_services/index-api.service';
import {SelectionModel} from '@angular/cdk/collections';
import { AuthenticationService } from '../../../_services/authentification.service';
import { DatePipe } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConstantService } from '../../../_services/constant.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChatComponent implements OnInit {
  
  all_utilisateur : any[];
  rows_utilisateur : any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  item_selected :any;
  selected_option = new SelectionModel<Element>(false, []);
  userConnecte: any;
  rows_messages : any[];
  message:any;
  nouvelItem:any;
  //id_chat:any;
  chatForm:   FormGroup;
  item_current :any;
  show_input_file: any;
  show_input_dialog_file: any;
  fileToUpload: File = null; 
  message_model:any; 

  constructor(private index_api: IndexApiService,private authenticationservice: AuthenticationService,public datepipe: DatePipe,public dialog: MatDialog,private _formBuilder: FormBuilder,private constant_service: ConstantService,private http: HttpClient) {
    // Set the private defaults
    this.reorderable      = true;
    this.loadingIndicator = true;
    this.rows_utilisateur = [];
    this.item_current = {};
    this.message_model = {message:null ,repertoire:null};
    this.show_input_file = false;
    this.show_input_dialog_file = false;
    if (this.authenticationservice.currentUserValue)
    {
      this.userConnecte = this.authenticationservice.currentUserValue; 
    }
   }
   updateFilter(event) {
     const val = event.target.value.toLowerCase();
     
      let ent = ["id","personnel.nom"];
     
  
     if (val == "") 
     {
       this.rows_utilisateur = this.all_utilisateur;
     }
     else 
     {
       // filter our data
       const temp = this.all_utilisateur.filter(function (d) {
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
       this.rows_utilisateur = temp;       
     // Whenever the filter changes, always go back to the first page
     // this.table.offset = 0;
     }
   }
   
   @ViewChild('modifDialog', { static: true }) modifDialog:TemplateRef<any>;
   @ViewChild('suppressionDialog', { static: true }) suppressionDialog:TemplateRef<any>;
  ngOnInit(): void {
    this.nouvelItem = false;
    this.chatForm = this._formBuilder.group(
      {
        messages:           ['', Validators.required]
      });
    this.index_api.getgeneralise("Utilisateurs","?type_get=findAll").subscribe(resp =>
      {
        this.all_utilisateur = [...resp.response];
        this.rows_utilisateur = [...resp.response];
        console.log(this.all_utilisateur);    
      });
      
    console.log(this.selected_option.selected); 
  }
  affiche_masque_input_file()
  {
      this.show_input_file=true;
  }
  
  affiche_masque_input_dialog_file()
  {
      this.show_input_dialog_file=true;
  }
  
  updateValue_repertoire(files: FileList,c,i)
  {
    this.fileToUpload = files.item(0);
  }
  onSelect(row) {
    
    //this.selected_option.toggle(row);
    this.index_api.getgeneralise("Chat","?menu=getmessageBydiscution&id_pesonnel_autre="+row.personnel.id+"&id_pesonnel_moi="+this.userConnecte.id_pers ).subscribe(resp =>
      {
        this.rows_messages = [...resp.response];  
      });
      
    this.selected_option.select(row);
    console.log(this.selected_option.selected[0]); 
    this.item_selected = this.selected_option.selected[0];
    this.show_input_file=false;
  }
  isFirstMessageOfGroup(message, i): boolean
    {
        return (i === 0 || this.rows_messages[i - 1] && this.rows_messages[i - 1].type_message !== message.type_message);
    }
    isLastMessageOfGroup(message, i): boolean
    {
        return (i === this.rows_messages.length - 1 || this.rows_messages[i + 1] && this.rows_messages[i + 1].type_message !== message.type_message);
    }
    ajout(etat_suppression,message)
    {
      this.nouvelItem=true;
      this.save_in_base(etat_suppression,message,this.nouvelItem);
    }
    openformulairemodification(chat)
    {console.log(chat);
      this.item_current =chat;
      var messages= chat;
      console.log(messages);
      this.nouvelItem=false;
      this.dialog.open(this.modifDialog, { disableClose: true,data: messages });
    }
    
    opendialogsuppression(chat)
  {
    var messages= chat;
    //this.item_current =chat;
    this.dialog.open(this.suppressionDialog, { disableClose: true,data: messages });
  }
   
  suppression(etat_suppression,chat)
  {
    console.log(chat);
    this.save_in_base(etat_suppression,chat,this.nouvelItem);
    
  } 
  FermerDialog()
  {
    this.dialog.closeAll();
  }
  annulermodal()
  {
    this.dialog.closeAll();
    this.nouvelItem=false;
    this.show_input_dialog_file=false;
    var chat_current=this.item_current;
    this.rows_messages.forEach(function(item)
        {console.log(chat_current.id);
           if (parseInt(item.id)==parseInt(chat_current.id))
           {
             item.message=chat_current.message;
           }
        });
        
        this.index_api.getgeneralise("Chat","?menu=getmessageBydiscution&id_pesonnel_autre="+this.item_selected.id_pers+"&id_pesonnel_moi="+this.userConnecte.id_pers ).subscribe(resp =>
          {
            this.rows_messages = [...resp.response]; 
            this.message_model = {message:null ,repertoire:null};
          });
  }
    modifier(etat_suppression,chat)
    {
      this.save_in_base(etat_suppression,chat,this.nouvelItem);
      
    }
  save_in_base(etat_suppression,chat_message,nouvelitem)
  {    

    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    if(this.fileToUpload)
    {    
      var file= this.fileToUpload;
      let chat_id=0;
      if (nouvelitem==true)
      { 
        this.index_api.getgeneralise("Chat","?menu=getmaxidchat").subscribe(resp =>
        {
          var id_max_base= resp.response;
          var id_max=1
          if (id_max_base[0].id)
          {
            id_max= parseInt(id_max_base[0].id) + 1;
          }
          var name_file =id_max+'_'+file.name ;      
            var repertoire = 'chat_piece_joint/';
            var name_replace = String(this.fileToUpload.name).replace(' ','_').replace('\'','_');
            var repertory = repertoire+id_max+'_'+name_replace;
            var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/save_upload_file";
            var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
            
                let data =
                {
                  id: chat_id,
                  supprimer: etat_suppression,
                  //date: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                  message: chat_message.message,
                  id_send: this.userConnecte.id_pers,
                  id_receive: this.item_selected.id_pers,
                  repertoire: repertory,
                  pas_supprimer:0
                }
              var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
              {
                if(!reponse_file['erreur'])
                {
                  this.index_api.add('Chat', this.convertion_data(data), config).subscribe((response) =>
                  { 
                      let item = {
                        id        :String(response['response']) ,
                        supprimer: etat_suppression,
                        date: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        message: chat_message.message,
                        id_send: this.userConnecte.id_pers,
                        id_receive: this.item_selected.id_pers,
                        type_message: "send",
                        repertoire: repertory,
                        pas_supprimer:0
                      
                      };
                      this.rows_messages.push(item); 
                    this.rows_messages = [...this.rows_messages]; 
                    console.log(this.rows_messages);
                    this.message_model = {message:null ,repertoire:null};
                    this.fileToUpload = null;
                    this.show_input_file=false;
                     
                    
                  }, error => {
                    alert("erreur");
                  });                  
                                
                }
              },
              (erreur) =>
              {                                 
                this.fileToUpload = null;
                this.show_input_file=false; 
              });
        });
      }
      else
      {        
        chat_id=chat_message.id
        var name_file =chat_id+'_'+file.name ;      
        var repertoire = 'chat_piece_joint/';
        var name_replace = String(this.fileToUpload.name).replace(' ','_').replace('\'','_');
        var repertory = repertoire+chat_id+'_'+name_replace;
        var uploadUrl  = this.constant_service.apiUrl + "importer_fichier/save_upload_file";
        var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
            
        let data =
          {
            id: chat_id,
            supprimer: etat_suppression,
            //date: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            message: chat_message.message,
            id_send: this.userConnecte.id_pers,
            id_receive: this.item_selected.id_pers,
            repertoire: repertory,
            pas_supprimer:chat_message.pas_supprimer
          }
          var upl= this.http.post(uploadUrl, fd).subscribe((reponse_file) =>
          {
                if(!reponse_file['erreur'])
                {
                  this.index_api.add('Chat', this.convertion_data(data), config).subscribe((response) =>
                  { 
                    if (etat_suppression==0)
                    {          
                      this.dialog.closeAll();                      
                      this.fileToUpload = null;
                      this.show_input_file=false;
                      this.rows_messages.forEach(function(item)
                      {
                        if (item.id==chat_message.id)
                        {
                          item.repertoire=repertory;
                        }
                      });
                      this.rows_messages = [...this.rows_messages];
                    }
                    else
                    {
                      this.rows_messages = this.rows_messages.filter((obj)=>
                          {                
                            return obj.id !== chat_id;
                          });
                      this.rows_messages = [...this.rows_messages];
                      this.dialog.closeAll();

                      if (repertory!=chat_message.repertoire)
                      {
                          var chemin= chat_message.repertoire;
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
                      this.fileToUpload = null;
                      this.show_input_file=false;
                    }                     
                    
                  }, error => {
                    alert("erreur");
                  });                  
                                
                }
            },
            (erreur) =>
            {                                 
              this.fileToUpload = null;
              this.show_input_file=false; 
            });
      }
    }
    else
    {
      let chat_id=0;
      let pas_supp=0;
      if (nouvelitem==false)
      {
        chat_id=chat_message.id
        pas_supp:chat_message.pas_supprimer
      }
      let data =
      {
        id: chat_id,
        supprimer: etat_suppression,
        //date: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        message: chat_message.message,
        id_send: this.userConnecte.id_pers,
        id_receive: this.item_selected.id_pers,
        pas_supprimer: pas_supp,        
        repertoire: chat_message.repertoire
      }
      console.log(data);
      this.index_api.add('Chat', this.convertion_data(data), config).subscribe((response) =>
      { 
        if (nouvelitem==true)
        {
          let item = {
            id        :String(response['response']) ,
            supprimer: etat_suppression,
            date: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            message: chat_message.message,
            id_send: this.userConnecte.id_pers,
            id_receive: this.item_selected.id_pers,
            type_message: "send",
            pas_supprimer: pas_supp,        
            repertoire: chat_message.repertoire
          
          };
          this.rows_messages.push(item); 
        this.rows_messages = [...this.rows_messages]; 
        console.log(this.rows_messages);
        this.message_model = {message:null ,repertoire:null};        
        this.fileToUpload = null;
        this.show_input_file=false;
        /* this.index_api.getgeneralise("Chat","?menu=getmessageBydiscution&id_pesonnel_autre="+this.item_selected.id_pers+"&id_pesonnel_moi="+this.userConnecte.id_pers ).subscribe(resp =>
            {
              this.rows_messages = [...resp.response]; 
              this.message = null ;
            });*/

        }
        else
        {
          if (etat_suppression==0)
          {          
            this.dialog.closeAll();            
            this.fileToUpload = null;
            this.show_input_file=false;
          }
          else
          {
            this.rows_messages = this.rows_messages.filter((obj)=>
                {                
                  return obj.id !== chat_id;
                });
            this.rows_messages = [...this.rows_messages];
            this.dialog.closeAll();            
            this.fileToUpload = null;
            this.show_input_file=false;
          }
        

        }  
        
      }, error => {
        alert("erreur");
      });

    }
    
  }
  message_pas_supprimer(message)
  {
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
      let data =
      {
        id: message.id,
        supprimer: 0,
        //date: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        message: message.message,
        id_send: message.id_send,
        id_receive: message.id_receive,
        pas_supprimer:1
      }
      console.log(data);
      this.index_api.add('Chat', this.convertion_data(data), config).subscribe((response) =>
      {  
        this.rows_messages.forEach(function(item)
        {
          if (item.id==message.id)
          {
            item.pas_supprimer=1;
          }
        });
        this.rows_messages = [...this.rows_messages];
      }, error => {
        alert("erreur");
      });
  }
  download_piece(message)
  {
    window.open(this.constant_service.apiUrlFile + message.repertoire);
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

}
