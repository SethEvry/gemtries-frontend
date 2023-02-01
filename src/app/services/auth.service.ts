import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl: string = `${environment.API_URL}/login`;

  constructor(private http: HttpClient, private uServ: UserService, private router: Router) {}

  login(username: string, password: string): void {
    localStorage.removeItem('token');
    this.http
      .post<{token:string}>(this.authUrl, { username, password }, {headers:{'content-type':'application/json'}})
      .subscribe((res) => {
        localStorage.setItem('token', res.token);
        this.uServ.getUser();
        this.router.navigate(['/']);
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.uServ.clearUser();
    this.router.navigate(['/login'])
  }
}
