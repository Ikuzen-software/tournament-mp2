import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TournamentService } from '../tournament.service';
import { Tournament } from '../tournament';
import { Store, select } from '@ngrx/store';
import * as fromAuth from '@reducers/login-page.reducer';
import { userSelector } from '@reducers/login-page.reducer';
import { error } from 'console';
import { UtilService } from '@tn/src/app/shared/services/util.service';
import { ToastService } from '@tn/src/app/shared/services/toast.service';
import { User } from '../../users/user';

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
  isAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor(private route: ActivatedRoute, private toastService: ToastService, private tournamentService: TournamentService, private router: Router, private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService) {
    route.params.subscribe((value) => {
      tournamentService.getById(value.tournamentId).pipe(
        take(1)
      ).subscribe((tournament) => {
        this.tournament = tournament;
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

// checkAvailability(){
//   this.tournamentService.getTournamentAvailability(this.tournament._id)
//     .pipe(
//       take(1))
//     .subscribe((result)=>{
//       if(result === "not full"){
//         this.isAvailable$.next(true);
//       }else{
//         this.isAvailable$.next(false);
//       }
//     })
// }

checkAvailability(): boolean{
  return this.tournament.size > this.tournament.participants.length ? true : false;
}
}


