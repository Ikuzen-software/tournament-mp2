type Player = string;
type Identifier = number;

class TournamentNode {
    constructor(public a?: TournamentNode | Player, public b?: TournamentNode | Player, public identifier?: Identifier) { }
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

// Removes byes from TournamentNode, AND return matches count
export function removeBye(node: TournamentNode, matchesCount = 1):number {
    
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
export function setIdentifiers(root: TournamentNode, withBye = false){
    let id = 0;
    if(!withBye) id = removeBye(root) - 1;
    let nodes: TournamentNode[] = [ root ];
    nodes = nodes.reverse();
    nodes[0].identifier = id+1
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if ((!(node instanceof TournamentNode))) {
        continue;
      }
  
      [ node.b, node.a ]
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
    if(!withBye) id = removeBye(root) - 1;
    let nodes: TournamentNode[] = [ root ];
    nodes = nodes.reverse();
    nodes[0].identifier = id+1
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if ((!(node instanceof TournamentNode))) {
        continue;
      }
  
      [ node.b, node.a ]
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

export function getTree(tree: Tournament, withBye = false): (TournamentNode | Player)[] { // return array of rounds in order, and matches to play
    const numRounds = calculateRounds(tree.players.length);
    console.log(numRounds)
    let numMatches = 1;
    let result = [];
    for (let currentRound = 1; currentRound <= numRounds; currentRound++) {
        result.push(tree.findMatchUpForRound(currentRound));
    }
    if (!withBye) numMatches = removeBye(tree.root)
    return result
}
interface NGNode {
    label: string
    children: NGNode[] | null
    expanded: boolean
    depth: number,
    identifier?: Identifier
  }
    
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
          children: null,
          expanded: true,
          depth,
        };
      } else {
        ngnode = {
          label: "Match "+ node.identifier,
          children: [ node.a, node.b ]
              .filter((child): child is TournamentNode | Player => !!child)
              .map(child => toNGNode(child, depth + 1)),
          expanded: true,
          depth,
          identifier:node.identifier
        };
      }
  
      byNode.set(node, ngnode);
  
      return ngnode;
    }
  
  
    toNGNode(tree.root, 0);
  
    return [ ...byNode.values() ].sort((a, b) => a.depth - b.depth);
  }
  
  
