export class LeadProperty {
    key: string;
    value: any;
}
export class Lead {
    constructor(phone: string, name: string, info: Object, avatar?: string) {
        this.phone = phone;
        this.name = name;
        this.created = new Date();
        this.avatar = avatar;
        this.info = [];
        for (let key in info) {
            this.info.push({key: key, value: info[key]});
        }
    }

    avatar: string;
    name: string;
    phone: string;
    created: Date;
    info: LeadProperty[];
}
