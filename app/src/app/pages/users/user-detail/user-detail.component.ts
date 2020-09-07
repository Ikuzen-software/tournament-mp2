import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament, TournamentPages } from '../../tournaments/tournament';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '@tn/src/app/shared/services/toast.service';
import { TournamentService } from '../../tournaments/tournament.service';
import { Store, select } from '@ngrx/store';
import { UtilService } from '@tn/src/app/shared/services/util.service';
import { take } from 'rxjs/operators';
import { userSelector } from '@tn/src/app/reducers/login-page.reducer';
import * as fromAuth from '@reducers/login-page.reducer';
import { UserService } from '../user.service';
import { User } from '../user';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  tournamentsAsParticipant: TournamentPages;
  tournamentsAsOwner: TournamentPages;
  user: User;
  isLoggedIn: boolean;
  isParticipating: boolean;
  isTournamentOwner: boolean = false;
  isAvailable$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor(private route: ActivatedRoute, private toastService: ToastService, private tournamentService: TournamentService, private userService: UserService, private router: Router, private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService) {
    route.params.subscribe((value) => {
      userService.getById(value.id).pipe(
        take(1)
      ).subscribe((user) => {
        console.log(user)
        this.user = user;
        tournamentService.getAll({"participant": user.username}).pipe(
          take(1)
        ).subscribe((tournaments)=>{
          console.log(tournaments)
          this.tournamentsAsParticipant = tournaments;
        },
        (err)=>{
          console.log(err);
        });
        tournamentService.getAll({"owner":user.username}).pipe(
          take(1)
        ).subscribe((tournaments)=>{
          console.log(tournaments)
          this.tournamentsAsOwner = tournaments;
        })
        },
          (err) => {
            console.log(err);
          });
    });
  }
  ngOnInit(): void {

  }

}
