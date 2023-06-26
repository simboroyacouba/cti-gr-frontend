export class Depacketage { 

    id?: BigInt;
	code?: string; 
    date?: Date;
    idArticleDimunition?:BigInt;
	idArticleAjout?: BigInt;
	idEmploye?: BigInt;
	quantiteArticleDimunition?: bigint;
	quantiteArticleAjout?: bigint;
	motif?: string;

    constructor(id?: BigInt,
        code?: string,
        date?: Date,
        idArticleDimunition?:BigInt,
        idArticleAjout?: BigInt,
        idEmploye?: BigInt,
        quantiteArticleDimunition?: bigint,
        quantiteArticleAjout?: bigint,
        motif?: string){
        
        this.id = id;
        this.code = code; 
        this.date =date;
        this. idArticleDimunition =  idArticleDimunition;
        this.idArticleAjout = idArticleAjout;
        this.idEmploye = idEmploye;
        this.quantiteArticleDimunition = quantiteArticleDimunition;
        this.quantiteArticleAjout = quantiteArticleAjout;
        this.motif = motif;
    }


}