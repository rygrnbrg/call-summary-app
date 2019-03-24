import { LeadTypeID } from './lead-property-metadata';
export class Contact {
    name: string;
    phone: string;

    constructor(phone: string, name: string){
        this.phone = phone;
        this.name = name;    
    }
}

export class Lead extends Contact {
    constructor(phone: string, name: string, avatar?: string) {
        super(phone, name);
        this.created = new Date();
        this.avatar = avatar? avatar : null;
    }

    avatar: string;
    name: string;
    phone: string;
    created: Date;
    type: LeadTypeID;
    property: string;
    rooms: string;
    source: string;  
    budget: number;
    area: string[];
}