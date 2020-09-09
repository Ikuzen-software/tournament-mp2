import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { userSelector } from '../../reducers/login-page.reducer';
import * as fromAuth from '@reducers/login-page.reducer';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UtilService } from '../../shared/services/util.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private readonly store: Store<fromAuth.ApplicationState>, public utilService: UtilService) {
  }
  user$: BehaviorSubject<{ username?: string, role?: string, id?: string }> = new BehaviorSubject({});

  ngOnInit(): void {
    this.store.pipe(select(userSelector)).subscribe((appState) => {
      this.user$.next(appState.currentUser);
    });
  }

}
