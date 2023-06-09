export class Invoice { 

    id?: BigInt;

	code?: string; 
	 
	idEmploye?: BigInt;
	 
	idClient?: BigInt;
	 
	idSession?: BigInt;

	montantTotal?: number;
	 
	remise?: number;
	 
	montantAPayer?: number;
	 
	clos?: boolean;
	 
	date?: Date;

    constructor(id?: BigInt,

        code?: string,
         
        idEmploye?: BigInt,
         
        idClient?: BigInt,
         
        idSession?: BigInt,
    
        montantTotal?: number,
         
        remise?: number,
         
        montantAPayer?: number,
         
        clos?: boolean,
         
        date?: Date){
        
            this.id = id;

            this.code = code;
             
            this.idEmploye = idEmploye;
             
            this.idClient = idClient
             
            this.idSession = idSession
        
            this.montantTotal = montantTotal
             
            this.remise = remise;
             
            this.montantAPayer = montantAPayer;
             
            this.clos = clos;
             
            this.date = date;
    }


}