export class Session { 

    id?: BigInt;

	code?: string; 
	 
	idCaisse?: BigInt;
	 
	idEmploye?: BigInt;
	 
	etat?: boolean;
	 
	dateOuverture?: Date;

	datefermeture?: Date;

    constructor(
    id?: BigInt,

	code?: string,
	 
	idCaisse?: BigInt,
	 
	idEmploye?: BigInt,
	 
	etat?: boolean,
	 
	dateOuverture?: Date,

	datefermeture?: Date){
        
            this.id = id;

            this.code = code;
             
            this.idCaisse = idCaisse;
             
            this.idEmploye = idEmploye;
             
            this.etat = etat;
             
            this.dateOuverture = dateOuverture;
        
            this.datefermeture = datefermeture;
    }


}