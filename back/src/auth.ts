import { MatchModel } from "./models/matches/matches-model";
import { TournamentModel } from "./models/tournaments/tournament-model";

var atob = require('atob');

const exjwt = require('express-jwt');
const jwt = require('njwt');

export const _secret = "kRRorxJyC1pUVDpFldyGz1jRPt8koOyj1xdHF9zxnvht2D1iwOXZDhBQdOKakJOc"

//jwtMW variable to protect entire routes
export const jwtMW = exjwt({
    secret: _secret
});

export function getUserFromToken(token?: string): any {
    if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return {
            _id: decodedToken._id,
            username: decodedToken.username,
            role: decodedToken.role,

        };
    }
    else {
        return {
            username: "",
            role: "guest",
        }
    }
}
// check if owner with getById methods <!> params id must be params.id
export async function isTournamentOwner(req, res, next) {
    var token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            success: false,
            message: `Sign in to continue.`,
        });
    }
    try {
        const user = getUserFromToken(token);
        const tournament = await TournamentModel.findOne({ _id: req.params.id }).exec();
        if (user.role === "admin" || user._id === tournament?.organizer?.organizer_id) {
            next();
        } else {
            return res.status(401).send({
                success: false,
                message: `You don't have the rights on this tournament.`,
                error: user+"  -  "+ tournament.organizer
            });
        }
    } catch (err) {
        return res.status(401).send({
            success: false,
            message: "Sign in to continue.",
        });
    }
}

//isLoggedIn method to check specific methods
export function isLoggedIn(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers.authorization?.split(' ')[1];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, _secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Missing token. Sign in to continue.'
                });
            }
            else if (decoded.body.exp < new Date(Date.now())) {
                res.send({
                    success: false,
                    message: 'Token Expired. Sign in to continue.'
                })
            }
            else {
                // if everything is good, save to request for use in other routes
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'Sign in to continue.'
        });
    }
}
//admin method to check if token is valid and of type admin
export function isAdmin(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers.authorization?.split(' ')[1];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, _secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Sign in to continue.'
                });
            } else {
                if (getUserFromToken(token).role === 'admin') {
                    next();
                }
                else {
                    return res.status(401).send({
                        success: false,
                        message: 'You need to have admin rights.'
                    });
                }
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'Sign in to continue.'
        });
    }
}

//is the match reportable by the current user
export async function isReportable(req, res, next) {
    var token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            success: false,
            message: `Sign in to continue.`,
        });
    }
    try {
        // check is Match is in a reportable state
        const match = await MatchModel.findOne({tournament_id: req.body.tournament_id, identifier:req.body.identifier})
        if(!match.player1_id || !match.player2_id){
            return res.status(401).send({
                success: false,
                message: "match is not reportable yet",
            });
        }//

        const user = getUserFromToken(token);
        const tournament = await TournamentModel.findOne({ _id: req.params.id }).exec();
        //check if admin or organizer
        if (user.role === "admin" || user._id === tournament?.organizer?.organizer_id) {
            next();
        } else {
            //checks if user is one of the match participant
            if(user._id === match.player1_id || user._id === match.player2_id) next();
            else{
                return res.status(401).send({
                    success: false,
                    message: `You don't have the rights on this tournament.`,
                    error: user+"  -  "+ tournament.organizer
                });
            }
        }
    } catch (err) {
        return res.status(401).send({
            success: false,
            message: "Sign in to continue.",
        });
    }
}