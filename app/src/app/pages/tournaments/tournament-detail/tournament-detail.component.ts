import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, pipe, from, iif, of, empty } from 'rxjs';
import { map, debounceTime, take, filter, tap } from 'rxjs/operators';
import { TournamentService } from '../tournament.service';
import { Tournament } from '../tournament';
import { Store, select } from '@ngrx/store';
import * as fromAuth from '@reducers/login-page.reducer';
import { userSelector } from '@reducers/login-page.reducer';
import { UtilService } from '@tn/src/app/shared/services/util.service';
import { ToastService } from '@tn/src/app/shared/services/toast.service';
import { User } from '../../users/user';
import { MatchService } from '../../matches/match.service';
import { STATUS as TnStatus } from '../../../../../../back/src/models/tournaments/tournament-status.enum';
import { Match } from '../../matches/match';

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss']
})
export class TournamentDetailComponent implements OnInit, AfterViewInit {
  tournament: Tournament;
  isLoggedIn: boolean;
  currentUser: User;
  isParticipating: boolean;
  isTournamentOwner: boolean = false;
  isAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isStarted$: BehaviorSubject<{ propagate: boolean, value: string }> = new BehaviorSubject({ propagate: false, value: '' })
  allMatches: Match[];
  showScoreDialog$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentMatchDisplayed: Match;

  tournamentStanding: {
    username: string,
    participant_id: string,
    rank: number,
    matchesPlayed: Match[]
  }[];
  constructor(private route: ActivatedRoute, private toastService: ToastService, private tournamentService: TournamentService, private router: Router, private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService, private matchService: MatchService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.route.params.subscribe((value) => {
      this.tournamentService.getById(value.tournamentId).pipe(
        take(1)
      ).subscribe((tournament) => {
        this.tournament = tournament;
        this.getTournamentStanding();
        this.matchService.getAllMatchesByTournamentId(this.tournament._id).subscribe((matches) => {
          this.allMatches = matches;
        });
        this.isStarted$
          .pipe(
            filter(x => x.propagate),
            debounceTime(500)
          )
          .subscribe((x) => {
            if (this.isStarted$.getValue().value === TnStatus.ongoing) {
              this.tournamentService.startTournament(tournament).subscribe(
                () => {
                  this.matchService.createAllMatchesById(tournament._id).subscribe((matches) => {
                    this.allMatches = matches;
                  });
                  this.toastService.success("Tournament start", "successfully started the tournament");
                  this.isStarted$.next({ propagate: false, value: TnStatus.ongoing })
                  this.tournament.status = TnStatus.ongoing;
                  this.getTournamentStanding();
                },
                (error) => {
                  this.toastService.success("failure", "cannot start the tournament");
                });
            } else if (this.isStarted$.getValue().value === TnStatus.notStarted) {
              this.tournamentService.stopTournament(tournament).subscribe((result) => {
                this.matchService.deleteAllMatchesById(tournament._id).subscribe((result) => {
                  this.allMatches = [];
                  this.toastService.success("Tournament stop", "successfully stopped the tournament");
                  this.isStarted$.next({ propagate: false, value: TnStatus.notStarted })
                  this.tournament.status = TnStatus.notStarted;
                  this.getTournamentStanding();
                });
              }
              );
            }
            else if (this.isStarted$.getValue().value === TnStatus.finished) {
              this.tournamentService.endTournament(tournament).subscribe((result) => {
                  this.toastService.success("Tournament finished", "successfully finished the tournament");
                  this.isStarted$.next({ propagate: false, value: TnStatus.finished })
                  this.tournament.status = TnStatus.finished;
              });
            }
          },
            (error) => {
              console.log(error)
              this.toastService.showError("error", error.error);
            }
          );
        this.isStarted$.next({ propagate: false, value: tournament.status })


        this.store.pipe(select(userSelector)).subscribe((appState) => {
          if (appState.currentUser.username) {
            this.isLoggedIn = true;
            this.currentUser = appState.currentUser as User;
            if (appState.currentUser.username === this.tournament.organizer.username || appState.currentUser.role === 'admin') { // if owner or admin, has edit rights
              this.isTournamentOwner = true;
            }
            if (this.tournament.participants.map(participant => participant.username).includes(appState.currentUser.username)) {
              this.isParticipating = true;
            } else {
              this.isParticipating = false;
            }
          } else {
            this.isLoggedIn = false;
          }
        },
          (err) => {
            this.isLoggedIn = false;
          });
      },
        (error) => {

        });
    });

  }


  onMatchClick(i) {
    this.currentMatchDisplayed = this.allMatches[i];
    this.showScoreDialog$.next(true);
  }

  isWinner(match: Match, id: string) {
    return match.winner_id === id ? true : false;
  }

  getTournamentStanding() {
    this.tournamentService.getTournamentStanding(this.tournament._id).subscribe(
      (standing) => {
        this.tournamentStanding = standing;
        this.tournamentStanding.forEach(participant => participant.matchesPlayed = participant.matchesPlayed.reverse());
      });
  }


  refresh(event?): void {
    this.matchService.getAllMatchesByTournamentId(this.tournament._id).subscribe((matches) => {
      this.allMatches = matches;
      this.tournamentService.getById(this.tournament._id).pipe(
        take(1)
      ).subscribe((tournament) => {
        this.tournament = tournament; //refresh the child component
        this.getTournamentStanding();
        if (this.tournament.participants.map(participant => participant.username).includes(this.currentUser.username)) {
          this.isParticipating = true;
        } else {
          this.isParticipating = false;
        }
      });
    })
  }

  joinTournament() {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.tournamentService.joinTournament(this.tournament._id, this.currentUser as User).pipe(
        take(1)
      ).subscribe((result) => {
        this.isParticipating = true;
        this.tournament.participants.push(this.currentUser);
        this.toastService.success("participation", "successfully joined the tournament")
        this.refresh();
      },
        (error) => {
          this.toastService.showError("error", "error");
        })
    }
  }

  leaveTournament() {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.tournamentService.leavetournament(this.tournament._id, this.currentUser as User).pipe(
        take(1)
      ).subscribe((result) => {
        this.isParticipating = false;
        this.toastService.success("participation", "successfully removed from the tournament");
        this.tournament.participants = this.tournament.participants.filter(user => user.username !== this.currentUser.username);
        this.refresh();

      },
        (error) => {
          this.toastService.showError("error", error.error);
        });
    }
  }


  checkAvailability(): boolean {
    if (this.tournament.status === TnStatus.finished) {
      return false;
    } else {
      return this.tournament.size > this.tournament.participants.length ? true : false;
    }
  }

  startTournament(): void {
    this.isStarted$.next({ propagate: true, value: TnStatus.ongoing });
  }

  stopTournament(): void {
    this.isStarted$.next({ propagate: true, value: TnStatus.notStarted });
  }

  updateSeeding(): void {
    this.tournamentService.updateSeeding(this.tournament).subscribe(() => {
      this.toastService.success("Update seeding", "successfully updated the tournament seeding list");
      this.refresh();
    }, (err) => {
      this.toastService.showError("Error", err.error);
    }
    );
  }
  showParticipantList() {
    console.log(this.tournament.participants)
  }

  showTournament() {
    console.log(this.tournament)
  }

  onScoreDialogClose(event) {
    this.showScoreDialog$.next(event)
  }

  endTournament() {
    this.isStarted$.next({ propagate: true, value: TnStatus.finished });
  }

  isStartable() {
    return this.tournament?.participants?.length > 1 ? true : false
  }

}


