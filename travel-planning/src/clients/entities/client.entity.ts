import { Contact } from "@contacts/entities/contact.entity";

export class ClientHasContact {
    id_client_has_contact?: string;
    id_client?: string;
    id_contact?: string;
    contacts?: Contact;
}

export class Client {
    id_client: string;
    name: string;
    company_name: string;
    address: string;
    status: boolean;
    client_has_contacts?: ClientHasContact[];
    contacts?: Contact[];
}