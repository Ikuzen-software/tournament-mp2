import { User } from "../users/user-interface";

export interface Tournament {
    _id: string;
    createdAt: Date;
    organizer?: {organizer_id:string, username:string};
    participants?: {participant_id:string, username:string};
    description?: string;
    game?: string;
    format?: string;
    reportOptions: {anyParticipant: boolean, bothParticipant: boolean}
    name: string;
    size: number;
    startDate: Date;
    status: string;
}