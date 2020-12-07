export enum MatchState {
    ongoing = 'ongoing',
    finished = 'finished',
    notStarted = 'not started',
    readyToStart = 'ready to start'
}

export interface Match {
    _id: string;
    player1_id: string;
    player2_id: string;
    tournament_id: string;
    matchState: MatchState;
    identifier: string;
    winner_id: string;
    loser_id: string;
    score: string;
}

