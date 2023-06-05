export class Article { 

    id?: BigInt;
    dateEnregistrement?: Date;
	code?: string; 
	codeBar?: string;
	nom?: string;
	description?: string;
	prixVente?: number;
	prixAchat?: number;
	idTypeArticle?: BigInt;
	actif?: boolean;
	achat?: boolean;
	photo?: string;
	stock?: bigint;
	stockMin?: BigInt;

    constructor(id?: BigInt,
        dateEnregistrement?: Date,
        code?: string,
        codeBar?: string,
        nom?: string,
        description?: string,
        prixVente?: number,
        prixAchat?: number,
        idTypeArticle?: BigInt,
        actif?: boolean,
        achat?: boolean,
        photo?: string,
        stock?: bigint,
        stockMin?: BigInt){
        
        this.id = id;
        this.code = code; 
        this.codeBar = codeBar; 
        this.nom = nom;
        this.description = description;
        this.prixVente = prixVente;
        this.prixAchat = prixAchat;
        this.idTypeArticle = idTypeArticle;
        this.actif = actif;
        this.achat = achat;
        this.photo = photo;
        this.stock = stock;
        this.stockMin = stockMin;
    }


}