import {Timestamp} from "typeorm";

export interface ISystem {
    id: number;
    name: string;
    logo: string | null;
    qr_code: string | null;
    logo_icon: string | null;
    phone: string;
    email?: string | null;
    zalo?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    deleted_at?: Timestamp | null;
}
