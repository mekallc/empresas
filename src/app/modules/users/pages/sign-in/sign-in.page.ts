import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private nav: NavController,
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  onSubmit = () => console.log('on Submit');
  onForgot = () => console.log('on Forgot');
  onRegister = () => this.nav.navigateForward('user/sign-up');

  loadForm = () => {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  };

}
