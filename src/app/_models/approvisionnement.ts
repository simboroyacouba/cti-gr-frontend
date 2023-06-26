export class Approvisionnement { 

    id?: BigInt;
	code?: string; 
    date?: Date;
    idArticle?:BigInt;
	idEmploye?: BigInt;
	idFournisseur?: BigInt;
	quantite?: bigint;
	motif?: string;
	description?: string;
	montantTotal?: number;
	ravitaillement?: boolean;

    constructor(id?: BigInt,
        code?: string,
        date?: Date,
        idArticle?:BigInt,
        idEmploye?: BigInt,
        idFournisseur?: BigInt,
        quantite?: bigint,
        motif?: string,
        description?: string,
        montantTotal?: number,
        ravitaillement?: boolean){
        
        this.id = id;
        this.code = code; 
        this.date =date;
        idArticle = idArticle;
        this.idEmploye = idEmploye;
        this.idFournisseur =idFournisseur
        this.quantite = quantite;
        this.motif = motif
        this.description = description;
        this. montantTotal = montantTotal;
	    this.ravitaillement = ravitaillement;
    }


}