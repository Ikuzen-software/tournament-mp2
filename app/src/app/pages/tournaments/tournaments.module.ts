import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { TournamentCreationComponent } from './tournament-creation/tournament-creation.component';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';
import { TournamentNotFoundComponent } from './tournament-not-found/tournament-not-found.component';
import { TournamentService } from './tournament-service/tournament.service';
import { PagesModule } from '../pages.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TournamentsComponent } from './tournaments.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [TournamentListComponent, TournamentCreationComponent, TournamentDetailComponent, TournamentEditComponent, TournamentNotFoundComponent, TournamentsComponent],
  imports: [
    CommonModule,
    CarouselModule,
    CardModule,
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
    PanelModule,
  ],
  providers:[]
})
export class TournamentsModule { }
