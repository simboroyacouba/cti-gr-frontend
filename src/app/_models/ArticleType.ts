export class ArticleType { 

    id?: BigInt;
	code?: string; 
	nom?: string;
	description?: string;
	actif?: boolean;

    constructor(id?: BigInt,
        code?: string,
        nom?: string,
        description?: string,
        actif?: boolean){
        
        this.id = id;
        this.code = code; 
        this.nom = nom;
        this.description = description;
        this.actif = actif;
    }


}