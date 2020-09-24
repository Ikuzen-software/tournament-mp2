export interface Tournament {
    _id: string;
    createdAt: Date;
    organizer?: {organizer_id:string, username:string};
    participants?: {participant_id:string, username:string};
    description?: string;
    game?: string;
    format?: string;
    name: string;
    size: number;
    startDate: Date;
    status: string;
}