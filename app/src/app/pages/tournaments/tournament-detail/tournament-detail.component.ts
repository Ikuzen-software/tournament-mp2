import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TournamentService } from '../tournament.service';
import { Tournament } from '../tournament';
import { Store, select } from '@ngrx/store';
import * as fromAuth from '@reducers/login-page.reducer';
import { userSelector } from '@reducers/login-page.reducer';
import { error } from 'console';
import { UtilService } from '@tn/src/app/shared/services/util.service';
import { ToastService } from '@tn/src/app/shared/services/toast.service';

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
            if (this.tournament.participants.includes(appState.currentUser)) {
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

  particpate() {
    if (!this.isLoggedIn) {
      this.utilService.navigate("login")
    }
    else if (!this.isParticipating) {
      this.store.pipe(select(userSelector)).subscribe((appState) => {
        this.tournament.participants.push(appState.currentUser);
        console.log(this.tournament)
        console.log(this.tournament._id)
        this.tournamentService.update(this.tournament._id, this.tournament).pipe(
          take(1)
        ).subscribe((result) => {
          this.isParticipating = true;
          this.toastService.success("participation", "successfully joined the tournament")
        },
          (error) => {
            this.toastService.showError("error", "something wrong happened")
          })
      })
    } else if (this.isParticipating) { // cancel participation
      this.store.pipe(select(userSelector)).subscribe((appState) => {
        this.tournament.participants = this.tournament.participants.filter(user => user.username !== appState.currentUser.username);
        this.tournamentService.update(this.tournament._id, this.tournament).pipe(
          take(1)
        ).subscribe((result) => {
          this.isParticipating = false;
          this.toastService.success("participation", "successfully removed the tournament")
        },
          (error) => {
            this.toastService.showError("error", "something wrong happened")
          });
      });
    }
    else {
      this.toastService.showError('error', "can't participate if user is already participating")
    }
  }

}
