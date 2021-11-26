import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbUserService } from '@modules/users/services/db-user.service';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private db: DbUserService,
    private nav: NavController,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  onSubmit = async () => {
    const loading = await this.loadingCtrl.create({ message: 'Loading...' });
    await loading.present();
    this.db.access(this.loginForm.value).subscribe(
      async (res) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Bienvenido ' + res.fist_name,
          mode: 'ios', position: 'top', duration: 1500
        });
        await toast.present();
        this.nav.navigateRoot('pages/home');
      },
      err => {
        loading.dismiss();
        console.log(err);
      }
    );
  };

  onForgot = () => console.log('on Forgot');
  onRegister = () => this.nav.navigateForward('user/sign-up');

  loadForm = () => {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  };

}
