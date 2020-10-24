type Player = string;

// const players = new Array(10)
//     .fill(null)
//     .map((value, index) => index + 1);

class TournamentNode {
    constructor(public a?: TournamentNode | Player, public b?: TournamentNode | Player) { }
}

export class Tournament {
    rounds: number = 0;
    players: string[];
    constructor(public root: TournamentNode, players: string[]) { 
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
        // .filter(node => !(node instanceof TournamentNode) || node.a && node.b); // filters out the player vs bye
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


export function createTree(players: Player[]):Tournament {
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
}

export function removeBye(node: TournamentNode) {
    for (const key of ["a", "b"] as (keyof TournamentNode)[]) {
        const child = node[key];

        if (child instanceof TournamentNode) {
            if (!child.a || !child.b) {
                node[key] = child.a || child.b;
            } else {
                removeBye(child);
            }
        }
    }
}

function calculateRounds(numPlayers: number): number {
    return Math.ceil(Math.sqrt(numPlayers))
}

export function predictAllRounds(tree: Tournament, withBye = true): (TournamentNode | Player )[]  { // return array of rounds in order, and matches to play
    const numRounds = calculateRounds(tree.players.length);
    let result = [];
    for (let currentRound = 1; currentRound <= numRounds; currentRound++) {
        result.push(tree.findMatchUpForRound(currentRound))
        if(!withBye) removeBye(tree.root);
    }
    return result
}