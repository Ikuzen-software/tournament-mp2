import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, pipe } from 'rxjs';
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
import { Subject } from 'rxjs/internal/Subject';
import { Match } from '../../matches/match';
import { element } from 'protractor';

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
  currentMatchDisplayed: Match;
  showScoreDialog$: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
        this.tournamentService.getTournamentStanding(this.tournament._id).subscribe((standing)=>{
          this.tournamentStanding = standing
        })
        this.matchService.getAllMatchesByTournamentId(this.tournament._id).subscribe((matches) => {
          this.allMatches = matches;
          if (this.tournament.status === TnStatus.ongoing)
            setTimeout(() => { this.addMatchClickEvents() }, 300);
        });
        this.isStarted$
          .pipe(
            filter(x => x.propagate),
            debounceTime(500)
          )
          .subscribe((x) => {
            if (this.isStarted$.getValue().value === TnStatus.ongoing) {
              this.tournamentService.startTournament(tournament).subscribe();
              this.matchService.createAllMatchesById(tournament._id).subscribe();
              this.toastService.success("Tournament start", "successfully started the tournament");
              this.isStarted$.next({ propagate: false, value: TnStatus.ongoing })
              this.tournament.status = TnStatus.ongoing
            } else if (this.isStarted$.getValue().value === TnStatus.notStarted) {
              this.tournamentService.stopTournament(tournament).subscribe();
              this.matchService.deleteAllMatchesById(tournament._id).subscribe();
              this.toastService.success("Tournament stop", "successfully stopped the tournament");
              this.tournament.status = TnStatus.notStarted
              this.isStarted$.next({ propagate: false, value: TnStatus.notStarted })
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
    this.showScoreDialog$.next(true)
  }

  isWinner(match:Match, id:string){
    return match.winner_id === id ? true : false;
  }

  addMatchClickEvents() {
    if (this.allMatches.length > 0) {
      for (let i = 1; i < this.allMatches.length; i++) {
        // Selecting the specific matches elements
        const ele = Array.from(document.getElementsByClassName(`match${i}`))[0].children[0].children[0].children[1].children[0];
        ele?.addEventListener('click', () => { this.onMatchClick(i - 1) })
      }
      // last match is the mother node
      const lastEle = Array.from(document.getElementsByClassName(`match${this.allMatches.length}`))[0].children[0].children[0].children[0].children[0];
      lastEle?.addEventListener('click', () => { this.onMatchClick(this.allMatches.length - 1) })
    }
  }

  refresh(): void {
    this.matchService.getAllMatchesByTournamentId(this.tournament._id).subscribe((matches) => {
      this.allMatches = matches;
      this.tournamentService.getById(this.tournament._id).pipe(
        take(1)
      ).subscribe((tournament) => {
        this.tournament = tournament; //refresh the child component
        this.tournamentService.getTournamentStanding(this.tournament._id).subscribe((standing)=>{
          this.tournamentStanding = standing
        });
          setTimeout(() => { this.addMatchClickEvents() }, 300);
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
            console.log(error)
            this.toastService.showError("error","error");
          })
      }
  }

  leaveTournament() {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
        this.tournament.participants = this.tournament.participants.filter(user => user.username !== this.currentUser.username);
        this.tournamentService.leavetournament(this.tournament._id, this.currentUser as User).pipe(
          take(1)
        ).subscribe((result) => {
          this.isParticipating = false;
          this.toastService.success("participation", "successfully removed from the tournament")
          this.refresh();

        },
          (error) => {
            this.toastService.showError("error", error.error);
          });
      }
  }


  checkAvailability(): boolean {
    return this.tournament.size > this.tournament.participants.length ? true : false;
  }

  startTournament(): void {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.isStarted$.next({ propagate: true, value: TnStatus.ongoing })
    }
  }

  stopTournament(): void {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.isStarted$.next({ propagate: true, value: TnStatus.notStarted })
    }
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

  onScoreDialogClose(bool) {
    this.showScoreDialog$.next(bool);
  }

  onScoreDialogSubmit(match) {
    this.matchService.reportMatch(match).pipe(
      take(1)
    ).subscribe(() => {
      this.refresh();
    });
  }

  endTournament(){
    this.tournamentService.endTournament(this.tournament).subscribe();
  }

}


