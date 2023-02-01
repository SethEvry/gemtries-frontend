import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;


  constructor(private userService: UserService, private authService: AuthService, private router: Router, private formBuilder: FormBuilder){}

  ngOnInit(): void {
    setTimeout(()=> {
      if(this.userService.user){
        this.router.navigate(['/']);
      }
    })
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    

  }

  onSubmit(){

    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value.username.toLowerCase(), this.loginForm.value.password);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 200);
    }

  }

}
