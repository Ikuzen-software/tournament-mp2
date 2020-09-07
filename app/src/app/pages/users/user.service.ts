import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { User } from './user';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {env} from "@app/app.constants";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions: { headers: HttpHeaders }
  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private loginService: LoginService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`
      })
    };
  }

  create(user: User) {
    return this.http.post<User>(`${env.SERVER_API_URL}/user`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${env.SERVER_API_URL}/user`);

  }
  getById(id: string) {
    return this.http.get<User>(`${env.SERVER_API_URL}/user/${id}`);
  }

  getByName(username: string) {
    return this.http.get<User>(`${env.SERVER_API_URL}/user/username/${username}`);
  }

  update(id: string, user: User) {
    return this.http.put<User>(`${env.SERVER_API_URL}/user/${id}`, user, this.httpOptions);

  }
  deleteById(id: string) {
    return this.http.delete<User>(`${env.SERVER_API_URL}/user/${id}`, this.httpOptions);

  }
  deleteAll() {
    return this.http.delete<User>(`${env.SERVER_API_URL}/user`, this.httpOptions);
  }
}
