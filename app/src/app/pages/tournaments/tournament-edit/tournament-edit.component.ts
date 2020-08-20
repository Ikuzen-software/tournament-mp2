import { Component, OnInit, Input } from '@angular/core';
import { Tournament } from '../tournament';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../tournament.service';
import { Store, select } from '@ngrx/store';
import { UtilService } from '@tn/src/app/shared/services/util.service';
import { take } from 'rxjs/operators';
import { userSelector } from '@tn/src/app/reducers/login-page.reducer';
import * as fromAuth from '@reducers/login-page.reducer';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidationErrorsService } from '@tn/src/app/shared/validation/services/validation-errors.service';
import { ToastService } from '@tn/src/app/shared/services/toast.service';

@Component({
  selector: 'app-tournament-edit',
  templateUrl: './tournament-edit.component.html',
  styleUrls: ['./tournament-edit.component.scss']
})
export class TournamentEditComponent implements OnInit {
  tournament: Tournament;
  tournamentForm: FormGroup = this.fb.group({
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
  
  get name() { return this.tournamentForm.value.name; }
  get description() { return this.tournamentForm.value.description; }
  get game() { return this.tournamentForm.value.game; }
  get format() { return this.tournamentForm.value.format; }
  get size() { return this.tournamentForm.value.size; }
  get startDate() { return this.tournamentForm.value.startDate; }
  
  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private fb: FormBuilder, private validation: ValidationErrorsService, private router: Router, private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService, public toastService: ToastService) {
    route.params.subscribe((value) => {
      tournamentService.getById(value.tournamentId).pipe(
        take(1)
      ).subscribe((tournament) => {
        this.store.pipe(select(userSelector)).subscribe((appState) => {
          if (appState?.currentUser?.username !== tournament.organizer.username && appState.currentUser.role !== 'admin') { // if owner or admin, has edit rights
            utilService.navigate('forbidden');
          }
          this.tournament = tournament;
          this.tournamentForm = this.fb.group({
            name: [this.tournament?.name, [
              Validators.required,
              Validators.minLength(4)],
              [this.validation.forbiddenTournamentNameValidator(this.tournament?.name)]
            ],
            description: [this.tournament?.description, [
            ]],
            game: [this.tournament?.game, [
              Validators.required
            ]],
            format: [this.tournament?.format, [
              Validators.required
        
            ]],
            size: [this.tournament?.size, [
              Validators.required
            ]],
            startDate: [this.tournament?.startDate, []]
          });
        });
      });
    });
  }

  ngOnInit(): void {
  }

  updateTournament(){
    if (this.tournamentForm.valid) {
      this.store.select(userSelector).subscribe((appState) => {
        const _organizer = appState.currentUser
        const tournamentId = this.tournament._id
        this.tournament = { name: this.name, description: this.description, game: this.game, format: this.format, size: this.size, startDate: this.startDate, organizer: _organizer };
        this.tournamentService.update(tournamentId,this.tournament).subscribe((result) => {
          this.toastService.success('Success', 'Edit successful');
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
