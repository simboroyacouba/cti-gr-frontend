import { Component, Input, OnInit } from '@angular/core';

import { LicenceService } from './_services/licence.service';
import { AccountService } from './_services/account.service';
import { User } from './_models';

import { Licence } from './_models/Licence';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from './_services/alert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Photo } from './_models/photo';
import { environment } from '@environments/environment';


@Component({ 
    selector: 'app-root', 
    templateUrl: 'app.component.html',
    styleUrls: [ './app.component.scss' ] })
export class AppComponent implements OnInit {
    imageProfil!:any;
    photo!: string;
    formLicence!: FormGroup;
    loading = false;
    submitted = false;
    user?: User | null;
    listRoles?: any[];
    menuCaissier = false;
    menuAdmin = false;
    menuManager = false;
   
    licenceDeSession = new Licence(
         undefined,
         undefined,
         undefined,
         undefined,
         undefined,
         undefined, 
    );

    licenceAInserer = new Licence(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined, 
   );
    
    static listRoles: any;

    openSidebar: boolean = true;
    menuSidebar!:any[];
    currentURL=''; 
    userConnected = false;
    
    constructor(
      private sanitizer: DomSanitizer,
        private formBuilder: FormBuilder,
        private accountService: AccountService, 
        private licenceService: LicenceService,
        private alertService: AlertService,
        ) {
            this.currentURL = window.location.href;//recupere l'url de la route actuelle
            
            //EN fontion de si la route est login ou pas il renvoie un booleen pour afficher ou non le menu dans le template
            if(this.currentURL.includes('login')){
                this.userConnected = false;
            }else{
                this.userConnected = true;
            }
        this.accountService.user.subscribe(x => this.user = x);
        this.listRoles = this.user?.roles;
        this.photo = `${environment.apiUrl}/api/auth/download?chemin=`+this.user?.profilePhoto?.replace(/\\/g, '/');
       
        this.menuCaissier = this.listRoles?.includes('ROLE_CAISSIER') as boolean;
        this.menuAdmin = this.listRoles?.includes('ROLE_ADMIN') as boolean;
        this.menuManager = this.listRoles?.includes('ROLE_MODERATOR') as boolean;
        console.log(this.user);
        console.log(this.menuCaissier, this.menuAdmin, this.menuManager);
        this.menuSidebar = [{
            link_name: "Accueil",
            link: "/",
            icon: "bx bx-grid-alt",
            sub_menu: [
              {
                link_name: "Créer",
                link: "/javascript",
              },
              ]
        }];
        
        if(this.menuCaissier == true){
            this.menuSidebar.push(
                 {
                  link_name: "Vendre",
                  link: null,
                  icon: "bx bx-collection",
                  sub_menu: [
                    {
                        link_name: "Créer",
                        link: "/javascript",
                      },
                    {
                      link_name: "Liste des utilisateurs",
                      link: "/users",
                    }
                  ]
                }
              );
        }
        

        if(this.menuManager == true){
            this.menuSidebar.push(
                {
                  link_name: "Articles",
                  link: null,
                  icon: "bx bx-collection",
                  sub_menu: [
                    {
                        link_name: "Créer",
                        link: "/articles/add",
                      },
                    {
                      link_name: "Liste",
                      link: "/articles",
                    }
                  ]
                },
                {
                  link_name: "Catégorie d'articles",
                  link: null,
                  icon: "bx bx-collection",
                  sub_menu: [
                    {
                        link_name: "Créer",
                        link: "articles/articleType/add",
                      },
                    {
                      link_name: "Liste",
                      link: "/articles/articleType",
                    }
                  ]
                }
                );
                
                
        }

        if(this.menuAdmin == true){
            this.menuSidebar.push(
               {
                  link_name: "Utilisateurs",
                  link: null,
                  icon: "bx bx-collection",
                  sub_menu: [
                    {
                        link_name: "Créer",
                        link: "/users/add",
                      },
                    {
                      link_name: "Liste des utilisateurs",
                      link: "/users",
                    }
                  ]
                });
              this.menuSidebar.push(  
                {
                  link_name: "params",
                  link: "/articles",
                  icon: "bx bx-collection",
                }
              );
        }
        console.log(this.menuSidebar)
        this.licenceService.get()
        .subscribe((response) => {
            this.licenceDeSession.licenceActive = response.licenceActive ; 
            this.licenceDeSession.dateFinLicence = response.dateFinLicence ; 
            this.licenceDeSession.dateDerniereIntroductionLicence = response.dateDerniereIntroductionLicence ; 
            
        });
    
        
        
    }
   

    ngOnInit() {
        this.formLicence = this.formBuilder.group({
            codeLicence: ['', Validators.required],
        });
        console.log("route : "+ this.currentURL);
        
    }

    showSubmenu(itemEl: HTMLElement) {
        itemEl.classList.toggle("showMenu");
      }
    get fLicence() { return this.formLicence.controls; }

    activateLicence(){
        this.submitted = true;
        this.loading = true;
         // reset alerts on submit
         this.alertService.clear();
        if (this.formLicence.invalid) {
            return;
        }
        this.licenceAInserer.codeLicence =  this.formLicence.get('codeLicence')?.value;
        this.licenceAInserer.codeEmploye = this.user?.code;
        
        console.log('code :'+this.licenceAInserer.codeLicence);
        console.log('codeemploye :'+this.licenceAInserer.codeEmploye );
        this.licenceService.insert(this.licenceAInserer)
            .subscribe((response) => { 
                console.log(response);
                this.loading = false;
            });
            location.reload();
    }

    
    getLicence(){
        this.licenceService.get()
        .subscribe((response) => {
            this.licenceDeSession.licenceActive = response.licenceActive ; 
            this.licenceDeSession.dateFinLicence = response.dateFinLicence ; 
            this.licenceDeSession.dateDerniereIntroductionLicence = response.dateDerniereIntroductionLicence ; 
            console.log(response);
        });
        console.log('Licence : '+this.licenceDeSession); 
    
    }
    logout() {
        this.accountService.logout();
        this.userConnected = false;
        location.reload();
    }
}