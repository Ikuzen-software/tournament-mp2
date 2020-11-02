import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, debounceTime, take } from 'rxjs/operators';
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

@Component({
  selector: 'app-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss']
})
export class TournamentDetailComponent implements OnInit {
  tournament: Tournament;
  isLoggedIn: boolean;
  isParticipating: boolean;
  isTournamentOwner: boolean = false;
  isAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isStarted$: Subject<string> = new Subject();
  constructor(private route: ActivatedRoute, private toastService: ToastService, private tournamentService: TournamentService, private router: Router, private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService, private matchService: MatchService) {
    route.params.subscribe((value) => {
      tournamentService.getById(value.tournamentId).pipe(
        take(1)
      ).subscribe((tournament) => {
        this.tournament = tournament;
        console.log(tournament.status)
        this.isStarted$.next(tournament.status);
        this.store.pipe(select(userSelector)).subscribe((appState) => {
          if (appState.currentUser.username) {
            this.isLoggedIn = true;
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

  ngOnInit(): void {
  }

  refresh():void {
    this.tournamentService.getById(this.tournament._id).pipe(
      take(1)
      ).subscribe((tournament) => {
        this.tournament = tournament;
      })
  }

  joinTournament() {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.store.pipe(select(userSelector)).subscribe((appState) => {
        this.tournamentService.joinTournament(this.tournament._id, appState.currentUser as User).pipe(
          take(1)
        ).subscribe((result) => {
          console.log(result)
          this.isParticipating = true;
          this.tournament.participants.push(appState.currentUser);
          this.toastService.success("participation", "successfully joined the tournament")
        },
          (error) => {
            console.log(error)
            this.toastService.showError("error", error.error);
          })
      })
    }
  }

  leaveTournament() {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.store.pipe(select(userSelector)).subscribe((appState) => {
        this.tournament.participants = this.tournament.participants.filter(user => user.username !== appState.currentUser.username);
        this.tournamentService.leavetournament(this.tournament._id, appState.currentUser as User).pipe(
          take(1)
        ).subscribe((result) => {
          this.isParticipating = false;
          this.toastService.success("participation", "successfully removed from the tournament")
        },
          (error) => {
            this.toastService.showError("error", error.error);
          });
      });
    }
  }


  checkAvailability(): boolean {
    return this.tournament.size > this.tournament.participants.length ? true : false;
  }

  // startTournament(): void {
  //   if (!this.isLoggedIn) {
  //     this.utilService.navigate("login")
  //   } else {
  //     this.isStarted$.pipe(
  //     debounceTime(500)
  //     ).subscribe({
  //       next: (res)=>{
  //         this.tournamentService.startTournament(this.tournament).subscribe((result)=>{
  //           res = result
  //           this.toastService.success("Tournament Start", "successfully started the tournament");
  //           this.refresh()
  //         },
  //         (error) => {
  //           this.toastService.showError("error", error.error);
  //         })
  //       }
  //       })
  //   }
  // }

  startTournament(): void {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.tournamentService.startTournament(this.tournament).pipe(
        take(1),
        debounceTime(500)
      ).subscribe((result)=>{
        this.toastService.success("Tournament started", "successfully started the tournament");
        this.matchService.createAllMatchesById(this.tournament._id).subscribe();
        this.refresh()
      },
      (error) => {
        console.log(error)
        this.toastService.showError("error", error.error);
      });
    }
  }

  stopTournament(): void {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    } else {
      this.tournamentService.stopTournament(this.tournament).pipe(
        take(1),
        debounceTime(500)
      ).subscribe((result)=>{
        this.matchService.deleteAllMatchesById(this.tournament._id).subscribe();
        this.toastService.success("Tournament stop", "successfully stopped the tournament");
        this.refresh()
      },
      (error) => {
        console.log(error)
        this.toastService.showError("error", error.error);
      });
    }
  }
}


