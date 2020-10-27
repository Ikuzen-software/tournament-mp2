import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tournament, TournamentPages } from './tournament';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LoginService } from '../login/login.service';
import { User } from '../users/user';
import {env} from "@app/app.constants";

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
    return this.http.post<Tournament>(`${env.SERVER_API_URL}/tournament`, tournament, this.getOptions());
  }

  getAll(queryParams?: any): Observable<TournamentPages> {
    let params = new HttpParams()
    //all the query params
    if(queryParams.game){
      params = params.set('game', queryParams.game);
    }
    if(queryParams.status){
      params = params.set('status', queryParams.status);
    }
    if(queryParams.limit){
      params = params.set('limit', queryParams.limit);
    }
    if(queryParams.page){
      params = params.set('page', queryParams.page);
    }
    if(queryParams.organizer){
      params = params.set('organizer', queryParams.organizer)
    }
    if(queryParams.participant){
      params = params.set('participant', queryParams.participant)
    }
    return this.http.get<TournamentPages>(`${env.SERVER_API_URL}/tournament`, {params});
  }

  getById(id: string) {
    return this.http.get<Tournament>(`${env.SERVER_API_URL}/tournament/${id}`);
  }

  getByName(name: string) {
    return this.http.get<Tournament>(`${env.SERVER_API_URL}/tournament/name/${name}`);
  }

  update(id: string, tournament: Tournament) {
    return this.http.put<Tournament>(`${env.SERVER_API_URL}/tournament/${id}`, tournament, this.getOptions());
  }

  joinTournament(id: string, user: User) {
    return this.http.put<Tournament>(`${env.SERVER_API_URL}/tournament/join/${id}`, user, this.getOptions());
  }

  leavetournament(id: string, user: User) {
    return this.http.put<Tournament>(`${env.SERVER_API_URL}/tournament/leave/${id}`, user, this.getOptions());
  }

  deleteById(id: string) {
    return this.http.delete<Tournament>(`${env.SERVER_API_URL}/tournament/${id}`, this.getOptions());

  }
  deleteAll() {
    return this.http.delete<Tournament>(`${env.SERVER_API_URL}/tournament`, this.getOptions());
  }

  getAllGames(){
    return this.http.get<string[]>(`${env.SERVER_API_URL}/tournament/other/games`);
  }

  getTournamentAvailability(id: string){
    return this.http.get<string>(`${env.SERVER_API_URL}/tournament/other/size/${id}`);
  }
  
  startTournament(tournament: Tournament){
    return this.http.patch<Tournament>(`${env.SERVER_API_URL}/tournament/start/${tournament._id}`, tournament ,this.getOptions());
  }
}