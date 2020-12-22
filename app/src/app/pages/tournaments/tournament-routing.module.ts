import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TournamentCreationComponent } from './tournament-creation/tournament-creation.component';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { TournamentNotFoundComponent } from './tournament-not-found/tournament-not-found.component';
import { TournamentsModule } from './tournaments.module';
import { AuthGuard } from '../../auth/auth.guard';
import { TournamentsComponent } from './tournaments.component';

export const routes: Routes = [
  {
    path: '',
    component: TournamentsComponent,
    children: [
      {
        path: 'creation',
        component: TournamentCreationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'detail/:tournamentId',
        component: TournamentDetailComponent,
      },
      {
        path: 'edit/:tournamentId',
        component: TournamentEditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'list',
        component: TournamentListComponent
      },
      {
        path: 'not-found',
        component: TournamentNotFoundComponent
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    TournamentsModule,
    RouterModule.forChild(routes)
  ]
})
export class TournamentRoutingModule { }
