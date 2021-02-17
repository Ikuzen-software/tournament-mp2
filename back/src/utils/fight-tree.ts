import { Match } from "../models/matches/matches-interface";
import { MatchModel } from "../models/matches/matches-model";
import { TournamentModel } from "../models/tournaments/tournament-model";

export class Player {
    username: string;
    participant_id: string;
};
export type Identifier = number;

export class TournamentNode {
    constructor(public a?: TournamentNode | Player, public b?: TournamentNode | Player, public identifier?: Identifier) { }
}

export class Tournament {
    rounds: number = 0;
    players: Player[];

    constructor(public root: TournamentNode, players: Player[]) {
        this.players = players
    }

    findMatchUpForRound(round: number) {
        const self = this;

        function recurse(nodes: (TournamentNode | Player)[], depth: number): (TournamentNode | Player)[] {
            if (depth > self.rounds - round) {
                throw new Error("invalid round number");
            } else if (depth === self.rounds - round) {
                return nodes;
            }

            return recurse(
                nodes
                    .flatMap(node => node instanceof TournamentNode ? [node.a, node.b] : [node])
                    .filter((node): node is TournamentNode | Player => !!node),
                depth + 1,
            );
        }

        return recurse([this.root], 0)
            .filter(node => !(node instanceof TournamentNode) || node.a && node.b); // filters out the player vs bye
    }
}


function highestPowerOfTwo(value: number) {
    let power = 0;
    let tmp = value;

    while (tmp > 1) {
        power++;
        tmp = tmp >> 1;
    }

    const rounded = 1 << power;
    return rounded == value ? power : power + 1;
}


export function createTree(players: Player[]): Tournament {
    if (players.length > 1) {

        const pow = highestPowerOfTwo(players.length);
        const nb = 1 << pow;

        function createNode(node: number, roundNB: number): TournamentNode {
            if (roundNB === nb) {
                return new TournamentNode(players[node - 1], players[roundNB - node]);
            }

            const nextNB = roundNB << 1;
            const a = createNode(node, nextNB);
            const b = createNode(roundNB - node + 1, nextNB);

            return new TournamentNode(a, b);
        }
        const tournament = new Tournament(createNode(1, 2), players);
        tournament.rounds = pow;

        return tournament;
    } else {
        return new Tournament(new TournamentNode(players[0]), players)
    }
}

// Removes byes from TournamentNode, AND return matches count
export function removeBye(node: TournamentNode, matchesCount = 1): number {

    for (const key of ["a", "b"]) {
        const child = node[key];
        if (child instanceof TournamentNode) {
            if (!child.a || !child.b) {
                node[key] = (child.a || child.b);
            } else {
                matchesCount = (removeBye(child, ++matchesCount));
            }
        }
    }
    return matchesCount
}

//return node with identifiers
export function setIdentifiers(root: TournamentNode, withBye = false) {
    let id = 0;
    if (!withBye) id = removeBye(root) - 1;
    let nodes: (TournamentNode | Player)[] = [root];
    nodes = nodes.reverse();
    (nodes[0] as TournamentNode).identifier = id + 1
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if ((!(node instanceof TournamentNode))) {
            continue;
        }

        [node.b, node.a]
            .filter((node): node is TournamentNode => node instanceof TournamentNode)
            .forEach((node) => {
                nodes.push(node)
                node.identifier = id--
            });
    }
    return root;
}

// returns array of matches in order
export function getArrayOfMatchesInOrderAndSetIdentifier(root: TournamentNode, withBye = false) {
    let id = 0;
    if (!withBye) id = removeBye(root) - 1;
    let nodes: TournamentNode[] = [root];
    nodes = nodes.reverse();
    nodes[0].identifier = id + 1
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if ((!(node instanceof TournamentNode))) {
            continue;
        }

        [node.b, node.a]
            .filter((node): node is TournamentNode => node instanceof TournamentNode)
            .forEach((node) => {
                nodes.push(node)
                node.identifier = id--
            });
    }
    return nodes.reverse();
}



function calculateRounds(numPlayers: number): number {
    return Math.ceil(Math.log2(numPlayers))
}

// gets array of matches of a tournament
export function getTreeWithIdentifiers(tree: Tournament): TournamentNode { // return array of rounds in order, and matches to play
    // method call solely for setting the identifier
    getArrayOfMatchesInOrderAndSetIdentifier(tree.root)
    return tree.root
}
// gets array of rounds of a tournament
export function getTreeRounds(tree: Tournament, withBye = false): (TournamentNode | Player)[][] { // return array of rounds in order, and matches to play
    getArrayOfMatchesInOrderAndSetIdentifier(tree.root)
    const numRounds = calculateRounds(tree.players.length);
    let numMatches = 1;
    let result = [];
    for (let currentRound = 1; currentRound <= numRounds; currentRound++) {
        result.push(tree.findMatchUpForRound(currentRound));
    }
    if (!withBye) numMatches = removeBye(tree.root)
    return result
}

// copy of interface TreeNode from PrimeNG
interface NGNode {
    label: string;
    children: NGNode[] | null;
    expanded: boolean;
    depth: number;
    identifier?: Identifier;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    leaf?: boolean;
    type?: string;
    parent?: NGNode;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
}

// convert a tree to an array usable for the primeNG tree component

export function convertTreeToArray(tree: Tournament, withBye = false) {
    if (!withBye) tree.root = setIdentifiers(tree.root);
    const byNode = new Map<TournamentNode | Player, NGNode>();

    function toNGNode(node: TournamentNode | Player, depth: number): NGNode {
        let ngnode = byNode.get(node);

        if (ngnode) {
            return ngnode;
        }

        if (!(node instanceof TournamentNode)) {
            ngnode = {
                label: node.toString(),
                data: node.toString(),
                children: null,
                expanded: true,
                depth,
                leaf: true,
            };
        } else {
            ngnode = {
                label: "",
                children: [node.a, node.b]
                    .filter((child): child is TournamentNode | Player => !!child)
                    .map(child => toNGNode(child, depth + 1)),
                expanded: true,
                depth,
                identifier: node.identifier,
                styleClass: `match${node.identifier}`
            };
        }

        byNode.set(node, ngnode);

        return ngnode;
    }


    toNGNode(tree.root, 0);

    return [...byNode.values()].sort((a, b) => a.depth - b.depth);
}


export async function getStanding(request, response) {

    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        const playersList = tournament.participants
        const tree = createTree(playersList);
        const roundsArray = getTreeRounds(tree);
        const numberOfRounds = roundsArray.length;
        const standingArray: {
            username: string,
            participant_id: string,
            rank: number,
            matchesPlayed: Match[]
        }[] = [];
        const matches = await MatchModel.find({ tournament_id: request.params.tnId }).exec();
        if (matches.length > 0) {
            for (let i = roundsArray.length - 1; i >= 0; i--) {
                const currentRound = roundsArray[i]
                for (let j = currentRound.length - 1; j >= 0; j--) {
                    const currentMatch = roundsArray[i][j]
                    if (!(currentMatch instanceof Player) && currentMatch?.identifier && matches?.[currentMatch.identifier - 1]?.matchState === "finished") {
                        const winner = playersList.find(player => player.participant_id === matches?.[currentMatch.identifier - 1]?.winner_id)
                        const loser = playersList.find(player => player.participant_id === matches?.[currentMatch.identifier - 1]?.loser_id)
                        let winnerPlayer, loserPlayer;
                        winnerPlayer = { username: winner?.username, participant_id: winner?.participant_id, rank: numberOfRounds - i < 3 ? numberOfRounds - i : roundsArray[i].length + 1, matchesPlayed: [matches[currentMatch.identifier - 1]] }
                        loserPlayer = { username: loser?.username, participant_id: loser?.participant_id, rank: numberOfRounds - i + 1 < 3 ? numberOfRounds - i + 1 : roundsArray[i].length + 1, matchesPlayed: [matches[currentMatch.identifier - 1]] }
                        if (!standingArray.find((participant) => participant.participant_id === winnerPlayer.participant_id)) {
                            standingArray.push(winnerPlayer)
                        } else {
                            standingArray.find((participant) => participant.participant_id === winnerPlayer.participant_id).matchesPlayed.push(matches[currentMatch.identifier - 1])
                        }
                        if (!standingArray.find((participant) => participant.participant_id === loserPlayer.participant_id)) {
                            standingArray.push(loserPlayer)
                        } else {
                            standingArray.find((participant) => participant.participant_id === loserPlayer.participant_id).matchesPlayed.push(matches[currentMatch.identifier - 1])
                        }
                    }
                    // case a match is not finished (non finished match is always the first match to find going from the top, for a given player)
                    else if (!(currentMatch instanceof Player) && matches?.[currentMatch.identifier - 1]?.matchState === "ready to start" || !(currentMatch instanceof Player) && matches?.[currentMatch.identifier - 1]?.matchState === "not started") {
                        if (matches[currentMatch.identifier - 1].player1_id || matches[currentMatch.identifier - 1].player1_id) {

                            const player1 = playersList.find(player => player.participant_id === matches?.[currentMatch?.identifier - 1]?.player1_id)
                            const player2 = playersList.find(player => player.participant_id === matches?.[currentMatch?.identifier - 1]?.player2_id)
                            if(player1) standingArray.push({
                                username: player1.username,
                                participant_id: player1.participant_id,
                                rank: numberOfRounds - i < 3 ? numberOfRounds - i : roundsArray[i].length + 1,
                                matchesPlayed: []
                            });
                            if(player2) standingArray.push({
                                username: player2.username,
                                participant_id: player2.participant_id,
                                rank: numberOfRounds - i < 3 ? numberOfRounds - i : roundsArray[i].length + 1,
                                matchesPlayed: []
                            });
                        }
                    }
                }
            }
        }
        //case tournament not started, everyone is first
        else {
            for (let player of playersList) {
                standingArray.push({
                    username: player?.username,
                    participant_id: player?.participant_id,
                    rank: 1,
                    matchesPlayed: []
                })
            }
        }
        return standingArray
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }

}