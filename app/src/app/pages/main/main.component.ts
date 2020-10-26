import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { userSelector } from '../../reducers/login-page.reducer';
import * as fromAuth from '@reducers/login-page.reducer';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UtilService } from '../../shared/services/util.service';
import { Round, TournamentNode } from '../../shared/components/tree';
import { MatchService } from '../matches/match.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    constructor(private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService, private matchService: MatchService) {
    }
    user$: BehaviorSubject<{ username?: string, role?: string, id?: string }> = new BehaviorSubject({});
    tournament_id = "5f58d8b136283128dcf8d292";
    ngOnInit(): void {
        this.store.pipe(select(userSelector)).subscribe((appState) => {
            this.user$.next(appState.currentUser);
        });
    }
}
