export class Data { 
    id?: BigInt;
    codeInstallation?:string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    champ1?: string;
    champ2?: string;
    champ3?: string;

    public Entreprise(
        id?: BigInt,
        codeInstallation?:string,
        nom?: string,
        prenom?: string,
        telephone?: string,
        email?: string,
        champ1?: string,
        champ2?: string,
        champ3?: string,){
  
            this.id = id;
           
            this.codeInstallation = codeInstallation;
           
            this.nom = nom;
           
            this.prenom = prenom;
           
            this.telephone = telephone;
           
            this.email = email;
           
            this.champ1 = champ1;
  
            this.champ2 = champ2;
            
            this.champ3 = champ3;
        }

}