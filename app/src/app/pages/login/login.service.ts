import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials, JWTResponse } from './login-interfaces'
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as action from '../../actions/login-page.actions'
import { ToastService } from 'src/app/shared/services/toast.service';
import { env } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token: string;
  constructor(private readonly store: Store, private router: Router, private route: ActivatedRoute, private http: HttpClient, private localStorageService: LocalStorageService, private toastService: ToastService) {
  }

  login(credentials: Credentials) {
    return this.http.post<JWTResponse>(`${env.SERVER_API_URL}/login`, credentials).pipe(
      tap((result) => {
        if (result.success) {
          this.clearToken();
          this.localStorageService.setToken(result.access_token, result.refresh_token);
          this.store.dispatch(action.login({
            currentUser: this.getUserFromToken(result.access_token)
          }));
          return "successfully connected";
        } else {
          return result.err;
        }
      },
        (error) => {
          return error.err;
        }));
  }

  logout() {
    this.clearToken();
    this.store.dispatch(
      action.login({
        currentUser: {
          username: '',
          id: '',
          role: 'guest'
        }
      })
    )
    this.router.navigate(["/main"]);
    this.toastService.success('successfully logged out', 'goodbye')
  }

  checkToken() {
    return this.getTokenVerification().pipe(
      map((response) => {
        if (response.body) {
          return true; // boolean
        } else {
          return false; // boolean
        }
      }),
      catchError((error: any) => {
        return of(false);
      })
    );
  }
  getUserFromToken(token?: string): any {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return {
        username: decodedToken.username,
        id: decodedToken._id,
        role: decodedToken.role
      };
    }
    else {
      return {
        username: "",
        id:"",
        role: "guest"
      }
    }
  }

  getTokenVerification(): Observable<any> {
    return this.http.get<{ header, body }>(`${env.SERVER_API_URL}/token/verify`, {
      headers: {
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }
    });
  }

  clearToken() {
    this.localStorageService.clearToken();
    this.token = "";
  }
}

