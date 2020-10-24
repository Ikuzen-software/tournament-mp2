export type Player = string;

export class TournamentNode {
    constructor(public a?: TournamentNode | Player, public b?: TournamentNode | Player) { }
}

export type Round = TournamentNode[]