import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { User } from '../../users/user';
import { Router } from '@angular/router';
import { ValidationErrorsService } from '@tn/src/app/shared/validation/services/validation-errors.service';
import { TournamentService } from '../tournament.service';
import { Tournament } from '../tournament';
import { Store, select } from '@ngrx/store';
import * as fromAuth from '@reducers/login-page.reducer';
import { userSelector } from '@reducers/login-page.reducer';

@Component({
  selector: 'app-tournament-creation',
  templateUrl: './tournament-creation.component.html',
  styleUrls: ['./tournament-creation.component.scss']
})
export class TournamentCreationComponent implements OnInit {

  tournamentForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(4)],
      [this.validation.forbiddenTournamentNameValidator()]
    ],
    description: ['', [
    ]],
    game: ['', [
      Validators.required
    ]],
    format: ['', [
      Validators.required

    ]],
    size: ['', [
      Validators.required
    ]],
    startDate: ['', []]
  });
  tournament: Tournament;
  get name() { return this.tournamentForm.value.name; }
  get description() { return this.tournamentForm.value.description; }
  get game() { return this.tournamentForm.value.game; }
  get format() { return this.tournamentForm.value.format; }
  get size() { return this.tournamentForm.value.size; }
  get startDate() { return this.tournamentForm.value.startDate; }


  constructor(private tournamentService: TournamentService, private router: Router, private fb: FormBuilder, private validation: ValidationErrorsService, private store: Store<fromAuth.ApplicationState>) { }

  ngOnInit(): void {
  }

  createTournament() {
    if (this.tournamentForm.valid) {
      this.store.select(userSelector).subscribe((appState) => {
        const _organizer = {username: appState.currentUser.username, organizer_id: appState.currentUser.id}
        this.tournament = { name: this.name, description: this.description, game: this.game, format: this.format, size: this.size, startDate: this.startDate, organizer: _organizer };
        this.tournamentService.create(this.tournament).subscribe((result) => {
          this.router.navigate([`/tournament/${result._id}`]);
        },
          (error) => {
            if (error.status) {
              console.log(error);
            }
          });
      });

    }
  }
}
