import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TournamentNode } from '../../shared/components/tree';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LoginService } from '../login/login.service';
import { Match } from './match';
import {env} from '@app/app.constants';
import { Tournament } from '../tournaments/tournament';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

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

  getAllMatchesByTournamentId(id: string){
    return this.http.get<(Match)[]>(`${env.SERVER_API_URL}/match/all/${id}`);
  }

  getById(id: string){
    return this.http.get<(Match)>(`${env.SERVER_API_URL}/match/${id}`);
  }
  getSeedingById(id: string){
    return this.http.get<(string | TournamentNode)[]>(`${env.SERVER_API_URL}/match/getTree/${id}`);
  }
  getTreeArraybyId(id: string){
    return this.http.get<any[]>(`${env.SERVER_API_URL}/match/getTreeArrayForComponent/${id}`);
  }
  createAllMatchesById(id: string){
    return this.http.post<Match[]>(`${env.SERVER_API_URL}/match/many/${id}`, {},  this.getOptions() );
  }
  deleteAllMatchesById(id: string){
    return this.http.delete<Match[]>(`${env.SERVER_API_URL}/match/many/${id}`, this.getOptions() );
  }
  reportMatch(match: Match){
    return this.http.put<Match>(`${env.SERVER_API_URL}/match/report`, match, this.getOptions() );
  }
}
