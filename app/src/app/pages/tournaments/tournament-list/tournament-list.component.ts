import { Component, OnInit } from '@angular/core';
import { Tournament, TournamentPages } from '../tournament';
import { Observable, pipe } from 'rxjs';
import { TournamentService } from '../tournament.service';
import { take, tap } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterUtils } from 'primeng/utils';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss']
})
export class TournamentListComponent implements OnInit {
  tournaments: TournamentPages;
  sortOptions: SelectItem[];
  gameFilterOptions: SelectItem[] = [];
  gameList: string[];
  gameFilterInput = null;
  statusFilterOptions: SelectItem[] = [];
  statusFilterInput = null;
  sortField: string;
  sortOrder: number;
  filters: string = "";
  params = { game: '', status: '', page: 1, limit: 10 };
  get paginationToolbar() {
    return `displaying ${this.tournaments.page * this.tournaments.limit - this.tournaments?.limit + 1} - ${Math.min(this.tournaments?.page * this.tournaments?.limit, this.tournaments.totalDocs)} of ${this.tournaments.totalDocs}`
  }
  constructor(private tournamentService: TournamentService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllTournaments().pipe(
      take(1)
    ).subscribe((result) => {
      this.tournaments = result;
    });

    this.tournamentService.getAllGames().pipe(
      take(1)
    ).subscribe((games) => {
      for (const game of games) {
        this.gameFilterOptions.push({ label: game, value: game });
      }
    });
    this.sortOptions = [
      { label: 'Most recent', value: '!createdAt' },
      { label: 'Least recent', value: 'createdAt' },
      { label: 'Name', value: 'name' },
      { label: 'Attendance', value: '!size' }
    ];
    this.statusFilterOptions = [
      { label: 'not started', value: 'not started' },
      { label: 'ongoing', value: 'ongoing' },
      { label: 'finished', value: 'finished' }
    ]
  }

  getAllTournaments(): Observable<TournamentPages> {
    return this.tournamentService.getAll(this.params);
  }

  updateTournamentListByGame(param?: string): void {
    this.params.game = param;
    this.updateTournamentList();
  }

  updateTournamentListByStatus(param?: string): void {
    this.params.status = param;
    this.updateTournamentList();
  }

  onPageChange(event) {
    if (!(this.params.page === parseInt(event.page) + 1)) {
      this.params.page = parseInt(event.page) + 1
      this.updateTournamentList();
    }
  }

  updateTournamentList() {
    this.getAllTournaments().subscribe((list) => {
      this.tournaments = list;
    })
  }
  onSortChange(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  onFilterChange(event) {
    let value = event.value;
    if (!this.filters.includes(value)) {
      this.filters += ',' + value;
    }
  }
  navigateTournament(tournament: Tournament) {
    this.router.navigate(['tournament/' + tournament._id]);
  }

}
