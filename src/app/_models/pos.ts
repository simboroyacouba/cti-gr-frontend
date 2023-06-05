export class Pos { 

    id?: BigInt;
	code?: string;
	nom?: string;
	actif?: boolean;

    constructor(id?: BigInt,
        code?: string,
        nom?: string,
        actif?: boolean){
        
        this.id = id;
        this.code = code;
        this.nom = nom;
        this.actif = actif;
    }


}