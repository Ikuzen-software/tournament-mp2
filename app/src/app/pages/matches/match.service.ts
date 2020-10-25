import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TournamentNode } from '../../shared/components/tree';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LoginService } from '../login/login.service';
import { Match } from './match';
import {env} from "@app/app.constants";

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

  getById(id: string){
    return this.http.get<(Match)[]>(`${env.SERVER_API_URL}/match/${id}`);
  }
  getSeedingById(id: string){
    return this.http.get<(string | TournamentNode)[]>(`${env.SERVER_API_URL}/match/seeding/${id}`);
  }
  getTreeArraybyId(id: string){
    return this.http.get<any[]>(`${env.SERVER_API_URL}/match/treeArray/${id}`);

  }
}
