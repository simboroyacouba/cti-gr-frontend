export class ArticleAVendre {
    idArticle?: BigInt;
    nomArticle?: string;
    idSession?: BigInt;
    idFacture?: BigInt;
    quantite?: number;
    prixUnitaire?: number;
    montant?: number;

    constructor(idArticle?: BigInt,
        nomArticle?: string,
        idSession?: BigInt,
        idFacture?: BigInt,
        quantite?: number,
        prixUnitaire?: number,
        montant?: number){

            this.idArticle = idArticle;
            this.nomArticle =  nomArticle;
            this.idSession = idSession;
            this.idFacture = idFacture;
            this.quantite = quantite;
            this.prixUnitaire = prixUnitaire;
            this.montant = montant;
        }
}