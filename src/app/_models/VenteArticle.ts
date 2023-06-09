export class VenteArticle {
    id?: BigInt;
    date?: Date;
    idArticle?: BigInt;
    idSession?: BigInt;
    idFacture?: BigInt;
    quantite?: number;
    prixUnitaire?: number;

    constructor(
        id?: BigInt,
        date?: Date,
        idArticle?: BigInt,
        idSession?: BigInt,
        idFacture?: BigInt,
        quantite?: number,
        prixUnitaire?: number){

            this.id = id;
            this.date = date;
            this.idArticle = idArticle;
            this.idSession = idSession;
            this.idFacture = idFacture;
            this.quantite = quantite;
            this.prixUnitaire = prixUnitaire;
        }
}