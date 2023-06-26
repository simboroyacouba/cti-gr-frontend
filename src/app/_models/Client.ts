export class Client { 

    id?: BigInt;

    code?: string;
  
    nom?: string;
    
    prenom?: string;

    telephone?: string;
    
    email?: string;
    
    dateAnniversaire?: Date;

    adresse?: string;
    
    dateEnregistrement?: Date;

    actif?: boolean;

    constructor(  id?: BigInt,
        code?: string,
        nom?: string,
        prenom?: string,
        telephone?: string,
        email?: string,
        adresse?: string,
        dateAnniversaire?:Date,
        dateEnregistrement?: Date,
        actif?: boolean,){
        
        this.id = id;
        this.code = code;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.adresse = adresse;
        this.dateAnniversaire = dateAnniversaire;
        this.dateEnregistrement = dateEnregistrement;
        this.actif = actif;
    }


}