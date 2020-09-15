export interface Tournament {
    _id?: string;
    createdAt?: Date;
    name?: string;
    size?: number;
    description?: string;
    participants?: {username?: string; participant_id?: string;}[];
    game?: string;
    format?: string;
    organizer?: {username?: string; organizer_id?};
    startDate?: Date;
    status?: string;
}

export interface TournamentPages {
    docs: Tournament[];
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: any;
    nextPage: any;
  }