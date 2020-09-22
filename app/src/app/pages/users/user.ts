import { Tournament } from '../tournaments/tournament';
export interface User {
    _id?: string;
    password: string;
    username: string;
    email: string;
    birthdate: Date;
    register_date?: Date;
    tournaments?: {tournament_id: string, name: string}[];
    overview?: UserOverview;

}

export interface UserOverview{
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    top8: number;
    totalMatches: number;
    totalParticipated: number;
    totalOrganized: number;
}