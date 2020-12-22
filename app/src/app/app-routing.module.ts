import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { TournamentsComponent } from './pages/tournaments/tournaments.component';
import { UsersComponent } from './pages/users/users.component';
import { TournamentDetailComponent } from './pages/tournaments/tournament-detail/tournament-detail.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';
import { TournamentCreationComponent } from './pages/tournaments/tournament-creation/tournament-creation.component';
import { TournamentEditComponent } from './pages/tournaments/tournament-edit/tournament-edit.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';



const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  {path: 'main', component: MainComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'login', component: LoginComponent },
  {path: 'users', component: UserListComponent },
  {path: 'user/:id', component: UserDetailComponent },
  {path: 'tournaments', component: TournamentsComponent },
  {path: 'tournament-create', canActivate: [AuthGuard], component: TournamentCreationComponent },
  {path: 'tournament-edit/:tournamentId', canActivate: [AuthGuard], component: TournamentEditComponent },
  {path: 'tournament/:tournamentId', component: TournamentDetailComponent },
  {path: 'forbidden',   component: ForbiddenComponent },
  {path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
