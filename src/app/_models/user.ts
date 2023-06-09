export class User { 

    id?: BigInt;

    code?: string;
  
    firstName?: string;
    
    lastName?: string;
  
    username?: string;
    
    password?: string;
    
    email?: string;
    
    idBox?: BigInt;
    
    registeredDate?: Date;

    roles?: string[]

    token?: string;
    
    tokenType?: string;

    actif?: boolean;
    profilePhoto?:string;

    constructor(id?: BigInt, code?: string, firstName?: string, lastName?: string, username?: string, password?: string, email?: string, idBox?: BigInt, registeredDate?: Date, roles?: string[], token?: string, tokenType?: string,  actif?: boolean, profilePhoto?:string){
        
        this.id = id;

        this.code = code;
  
        this.firstName = firstName;
        
        this.lastName = lastName;
    
        this.username = username;

        this.password = password;
        
        this.email = email;
        
        this.idBox = idBox;
        
        this.registeredDate = registeredDate;

        this.roles = roles;

        this.token = token;

        this.tokenType = tokenType;

        this.actif = actif;

        this.profilePhoto = profilePhoto;
    }

    setProfilePhoto(profilePhoto: string){
        this.profilePhoto = profilePhoto?.replace(/\\/g, '/');
    }

}