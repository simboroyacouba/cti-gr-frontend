export class Fournisseur { 

    id?: BigInt;

    code?: string;
  
    nom?: string;
    
    telephone?: string;
  
    description?: string;
    
    email?: string;
    
    adresse?: string;
    
    dateEnregistrement?: Date;

    actif?: boolean;

    constructor(  id?: BigInt,
        code?: string,
        nom?: string,
        telephone?: string,
        description?: string,
        email?: string,
        adresse?: string,
        dateEnregistrement?: Date,
        actif?: boolean,){
        
        this.id = id;
        this.code = code;
        this.nom = nom;
        this.telephone = telephone;
        this.description = description;
        this.email = email;
        this.adresse = adresse;
        this.dateEnregistrement = dateEnregistrement;
        this.actif = actif;
    }


}