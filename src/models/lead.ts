import { attachEmbeddedView } from "@angular/core/src/view";

export class Lead {
    constructor(phone: string, name: string, avatar?: string) {
        this.phone = phone;
        this.name = name;
        this.created = new Date();
        this.avatar = avatar? avatar : null;
    }

    avatar: string;
    name: string;
    phone: string;
    created: Date;
    type: string[];
    property: string[];
    rooms: string[];
    area: string[];
    source: string[];  
    budgetMin: number;
    budgetMax: number;
}
