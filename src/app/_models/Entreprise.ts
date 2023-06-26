export class Entreprise { 

    nom?: string;
    sigle?: string;
    description?: string;
    monnaie?: string;
    formeJuridique?: string;
    ifu?: string;
    rccm?: string;
    pays?: string;
    ville?: string;
    texte1?: string;
    texte2?: string;
    texte3?: string;
    texte4?: string;
    image?: string;

    public Entreprise(
            nom?: string,
            sigle?: string,
            description?: string,
            monnaie?: string,
            formeJuridique?: string,
            ifu?: string,
            rccm?: string,
            pays?: string,
            ville?: string,
            texte1?: string,
            texte2?: string,
            texte3?: string,
            texte4?: string,
            image?: string){
  
            this.nom = nom;
           
            this.sigle = sigle;
           
            this.description = description;
           
            this.monnaie = monnaie;
           
            this.formeJuridique = formeJuridique;
           
            this.ifu = ifu;
           
            this.rccm = rccm;
  
            this.pays = pays;
            
            this.ville = ville;
  
            this.texte1 = texte1;
            
            this.texte2 = texte2;
            
            this.texte3 = texte3;
            
            this.texte4 = texte4;
            
            this.image = image;
        }

}