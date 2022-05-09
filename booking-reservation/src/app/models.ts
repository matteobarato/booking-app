export class Book {
    id: Number;
    start_at: string | Date;
    end_at: string | Date;
    note: string;
    peopleNumber: Number;
    people: People = new People();
    status: Number = 0;
    room: Number;
    bill: { key: string; value: number }[] = [];
    is_online:boolean = false
    _total: number;
    _editable: boolean = false;
    constructor() {
        this.people = new People();
    }
}

export class BookStatus {
    confirmed: Number = 1;
    pending: Number = 0;
    canceled: Number = -1;
    online: Number = 2;
    draft: Number = 3;
}

export class Membro {
    cognome_nome: string;
    sesso: string;
    data_nascita: string;
    luogo_nascita: string;
    cittadinanza: string;
}

export class People {
    cognome_nome: string;
    sesso: string;
    data_nascita: string;
    luogo_nascita: string;
    cittadinanza: string;
    tipo_documento: string;
    numero_documento: string;
    luogo_data_rilascio: string;
    residenza: string;
    membri_gruppo: Membro[] = [];
    email: string;
    cellulare: string;

    constructor() {
        this.membri_gruppo = [];
    }
}

export class Room {
    id: number
    name: string
    capacity_adult: number
    capacity_child: number
    note: string
    bookings: any[]
    current_price: number
    color: string
    is_online:boolean = false
    rent_tax: number
    _editable: boolean
}