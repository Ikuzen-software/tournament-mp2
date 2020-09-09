import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarouselModule} from 'primeng/carousel';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { TournamentListComponent } from './tournaments/tournament-list/tournament-list.component';
import { TournamentDetailComponent } from './tournaments/tournament-detail/tournament-detail.component';
import { MainComponent } from './main/main.component';
import { TreeModule } from 'primeng/tree';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { UtilService } from '../shared/services/util.service';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ToastService } from '../shared/services/toast.service';
import {ToastModule} from 'primeng/toast';
import { SharedModule } from '../shared/shared.module';
import {TooltipModule} from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ValidationErrorsService } from '../shared/validation/services/validation-errors.service';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { TournamentCreationComponent } from './tournaments/tournament-creation/tournament-creation.component';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import { TournamentNotFoundComponent } from './tournaments/tournament-not-found/tournament-not-found.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FilterUtils} from 'primeng/utils';
import { TournamentEditComponent } from './tournaments/tournament-edit/tournament-edit.component';
import {ProgressBarModule} from 'primeng/progressbar';



@NgModule({
  declarations: [UserDetailComponent, UserListComponent, TournamentListComponent, TournamentDetailComponent, TournamentsComponent, TournamentCreationComponent, MainComponent, LoginComponent, RegisterComponent, PasswordRecoveryComponent, ForbiddenComponent, TournamentCreationComponent, TournamentNotFoundComponent, TournamentEditComponent],
  imports: [
    CommonModule,
    CarouselModule,
    CardModule,
    TreeModule,
    HttpClientModule,
    FormsModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    SharedModule,
    TooltipModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    PaginatorModule,
    TableModule,
    DataViewModule,
    DropdownModule,
    PanelModule,
    InputTextareaModule,
    TabViewModule,
    ProgressBarModule,
    PanelModule
  ],
  providers:[LocalStorageService, UtilService, ToastService, ValidationErrorsService],
  exports:[UserDetailComponent, UserListComponent, TournamentListComponent, TournamentDetailComponent, MainComponent, TournamentsComponent, TournamentCreationComponent, TournamentEditComponent]
})
export class PagesModule { }
