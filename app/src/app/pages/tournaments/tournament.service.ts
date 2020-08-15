import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tournament, TournamentPages } from './tournament';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private loginService: LoginService) {
    
  }

  getOptions(){
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`
      })
    };
  }
  create(tournament: Tournament) {
    return this.http.post<Tournament>('http://localhost:3000/tournament', tournament, this.getOptions());
  }

  getAll(queryParams?: any): Observable<TournamentPages> {
    let params = new HttpParams()
    if(queryParams.game){
      params = params.set('game', queryParams.game);
    }
    if(queryParams.status){
      params = params.set('status', queryParams.status);
    }
    console.log(params)
    return this.http.get<TournamentPages>('http://localhost:3000/tournament', {params});
  }

  getById(id: string) {
    return this.http.get<Tournament>(`http://localhost:3000/tournament/${id}`);
  }

  getByName(name: string) {
    return this.http.get<Tournament>(`http://localhost:3000/tournament/name/${name}`);
  }

  update(id: string, tournament: Tournament) {
    return this.http.put<Tournament>(`http://localhost:3000/tournament/${id}`, tournament, this.getOptions());
  }

  deleteById(id: string) {
    return this.http.delete<Tournament>(`http://localhost:3000/tournament/${id}`, this.getOptions());

  }
  deleteAll() {
    return this.http.delete<Tournament>('http://localhost:3000/tournament', this.getOptions());
  }

  getAllGames(){
    return this.http.get<string[]>('http://localhost:3000/tournament/other/games');

  }
}