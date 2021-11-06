import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { ConstantService } from './constant.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private router: Router, private http: HttpClient, private constantService: ConstantService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${this.constantService.apiUrl}/users/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  get_user(email, pwd) {
    return this.http.get<any>(this.constantService.apiUrl + 'utilisateurs?email=' + email + '&pwd=' + pwd).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      if (parseInt(user.response.enabled) == 1) {
        localStorage.setItem('currentUser', JSON.stringify(user.response));
        this.currentUserSubject.next(user.response);
        return user;
      } else {
        this.currentUserSubject.next(null);
        return user;
      }
    }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}