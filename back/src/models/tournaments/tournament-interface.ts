import { User } from "../users/user-interface";

export interface Tournament {
    _id: string;
    createdAt: Date;
    organizer?: {id:string, username:string};
    participants?: {_id:string, username:string};
    description?: string;
    game?: string;
    format?: string;
    name: string;
    size: number;
    startDate: Date
    status: string
}