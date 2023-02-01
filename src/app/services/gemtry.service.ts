import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Gemtry } from '../Models/Gemtry';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GemtryService {
  private _gemtries: Gemtry[] = [];
  private _dailyGemtries: Gemtry[] = [];
  private url = environment.API_URL + '/gemtries';

  constructor(private http: HttpClient, private userService: UserService) {}

  get gemtries() {
    return this._gemtries;
  }

  get daily(){
    return this._dailyGemtries;
  }

  getGemtries() {
    this.http
      .get<Gemtry[]>(this.url, {
        headers: { 'content-type': 'application/json' },
      })
      .subscribe((res) => (this._gemtries = res));
  }

  getDailies(){
    const today = new Date();
    today.setHours(today.getHours()-6);
    this.http.get<Gemtry[]>(`${this.url}/${today.toString()}`, {
      headers: { 'content-type': 'application/json' },
    }).subscribe(res => {
      this._dailyGemtries = res;
    })
  }

  saveGemtries(gemtries: Gemtry[]) {
    this.http.post<Gemtry[]>(this.url, gemtries, {
      headers: { 'content-type': 'application/json' },
    }).subscribe(res=> {
      this._gemtries = res;
      this.userService.getUser();
    })
  }

}
