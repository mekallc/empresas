import { filter, map } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonSlides, NavController, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import * as actions from '@store/actions';
import { AppState } from '@store/app.state';
import { StorageService } from '@core/services/storage.service';
import { AuthService } from '@modules/users/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage implements OnInit, AfterViewInit {
  @ViewChild('slides') slides: IonSlides;
  options = { initialSlide: 0, };
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private db: AuthService,
    private nav: NavController,
    private store: Store<AppState>,
    private storage: StorageService,
    private loadCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  };

  onSubmit = async () => {
    if (this.loginForm.invalid) { return; }
    const load = await this.loadCtrl.create({message: 'Loading...'});
    await load.present();
    this.db.signIn(this.loginForm.value)
    .subscribe(async(res: any) => {
      await this.setDataReduxStorage(res);
      this.getState();
      this.loadCtrl.dismiss();
      this.router.navigate(['/pages', 'home'])
    }, err => {
      this.loadCtrl.dismiss();
      this.db.alertErr(err.error);
      this.loginForm.reset();
    });
  };

  loadForm = () => {
    this.loginForm = this.fb.group({
      email: ['cliente2222@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(4)]],
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  };

  goToSlides = (slide: number) => {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
  };

  setDataReduxStorage =  async (user: any) => {
    await this.storage.setStorage('userCompany', user);
    await this.storage.setStorage('tokenCompany', user.access);
  }

  onForgotPassword = () => console.log('onSubmit');
  onRegister = () => this.nav.navigateForward('/user/signUp');

  private getState = () => {
    this.store.dispatch(actions.loadCompany());
  };
}
