import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.confirmedValidator(),
      }
    );
  }

  onSubmit() {
    this.userService.register({
      id: 0,
      username: this.registerForm.value.username.toLowerCase(),
      password: this.registerForm.value.confirmPassword,
      hasSubmitted: false,
    });
  }

  confirmedValidator() {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls['password'];
      const matchingControl = formGroup.controls['confirmPassword'];
      if (matchingControl.errors) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
