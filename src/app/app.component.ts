import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gemtries';

  constructor(private userService: UserService){}

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.userService.getUser();
    }
  }

  get user(){
    return this.userService.user;
  }

}
