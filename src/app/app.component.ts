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
    
    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService, 
        private licenceService: LicenceService,
        private alertService: AlertService,
        ) {
            this.currentURL = window.location.href;//recupere l'url de la route actuelle
            
            //EN fontion de si la route est login ou pas il renvoie un booleen pour afficher ou non le menu dans le template
           
        this.accountService.user.subscribe(x => this.user = x);
        
        this.listRoles = this.user?.roles;
        this.photo = `${environment.apiUrl}/api/auth/download?chemin=`+this.user?.profilePhoto?.replace(/\\/g, '/');
       
        this.menuCaissier = this.listRoles?.includes('ROLE_CAISSIER') as boolean;
        this.menuAdmin = this.listRoles?.includes('ROLE_ADMIN') as boolean;
        this.menuManager = this.listRoles?.includes('ROLE_MODERATOR') as boolean;
        
    
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

        
        this.menuSidebar = [
          {
            link_name: "Accueil",
            link: "",
            icon: "bx bx-grid-alt",
            sub_menu: []
          },
          {
            link_name: "Vendre",
            link: "/vente/",
            icon: "bx bx-collection",
            sub_menu: []
          },
          
          {
            link_name: "Articles",
            link: "/articles",
            icon: "bx bx-collection",
            sub_menu: [
              {
                link_name: "Liste des articles",
                link: "/articles",
              },
              {
                link_name: "Liste des catégories d'article",
                link: "/articles/articleType",
              }
            ]
          },
         
          {
            link_name: "Utilisateurs",
            link: "/users",
            icon: "bx bx-collection",
            sub_menu: []
          },
          {
            link_name: "Points de vente",
            link: "/pos",
            icon: "bx bx-collection",
            sub_menu: []
          },
          {
            link_name: "Rapport de vente",
            link: "rapport/vente",
            icon: "bx bx-collection",
            sub_menu: []
          },
          {
            link_name: "Rapport de facturation",
            link: "rapport/facturation",
            icon: "bx bx-collection",
            sub_menu: []
          },
          {
            link_name: "Clients",
            link: "client",
            icon: "bx bx-collection",
            sub_menu: []
          },
          {
            link_name: "Entreprise",
            link: "entreprise",
            icon: "bx bx-collection",
            sub_menu: []
          }
        ];
      
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
        location.reload();
    }
}