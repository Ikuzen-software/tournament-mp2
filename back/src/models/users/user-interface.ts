import { Tournament } from "../tournaments/tournament-interface";

export interface User {
    _id: string;
    username: string;
    password: string;
    email: string;
    register_date: Date;
    tournaments: Tournament[];
    overview: UserOverview;
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

export const defaultOverview = {
    firstPlace: 0,
    secondPlace: 0,
    thirdPlace: 0,
    top8: 0,
    totalMatches: 0,
    totalParticipated: 0,
    totalOrganized: 0
} as UserOverview;