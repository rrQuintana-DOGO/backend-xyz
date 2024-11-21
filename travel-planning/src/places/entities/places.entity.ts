import { Contact } from '@app/contacts/entities/contact.entity';
import { Geofence } from '@app/geofences/entities/geofence.entity';
export class PlaceHasContacts {
    id_place_has_contact?: string;
    id_place?: string;
    id_contact?: string;
    contacts?: Contact;
}

export class Places {
    public id_place: string;
    public id_place_type : string;
    public id_geofence : string;
    public name : string;
    public location : string;
    public address : string;
    public status : boolean;
    public place_has_contacts?: PlaceHasContacts[];
    public contacts?: Contact[];
    public geofences: Geofence
}