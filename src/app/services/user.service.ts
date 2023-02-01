import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../Models/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: User | null = null;
  private url: string = `${environment.API_URL}/users`;

  constructor(private http: HttpClient, private router: Router) {}

  get user() {
    return this.currentUser;
  }

  getUser() {
    this.http.get<User>(this.url)
    .subscribe((res) => {
      if(res){
      this.currentUser = res;
      } else {
        localStorage.removeItem('token');
      }
    });
  }

  clearUser() {
    this.currentUser = null;
  }

  register(user: User) {
    localStorage.removeItem('token');
    this.http
      .post<User | undefined>(this.url + '/register', user, {
        headers: { 'content-type': 'application/json' },
      })
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/login']);
        } else {
          alert('A user with that username already exists');
        }
      });
  }
}
