export class Licence { 

    id?: BigInt;

    codeLicence?: string;

    codeEmploye?: string;

    dateFinLicence?: string;

    dateDerniereIntroductionLicence?: string;

    licenceActive?: boolean;



    constructor(id?: BigInt,codeLicence?: string, codeEmploye?: string,dateFinLicence?: string,dateDerniereIntroductionLicence?: string, licenceActive?: boolean,
){
        
        this.id = id;
        
        this.codeLicence = codeLicence;

        this.codeEmploye = codeEmploye
    
        this.dateFinLicence = dateFinLicence;
    
        this.dateDerniereIntroductionLicence = dateDerniereIntroductionLicence;
    
        this.licenceActive = licenceActive;
    
    }
}