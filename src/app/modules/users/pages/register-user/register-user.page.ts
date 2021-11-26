import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterService } from '@core/services/master.service';
import { Observable } from 'rxjs';

import { Camera, CameraResultType } from '@capacitor/camera';
import { DbUserService } from '@modules/users/services/db-user.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  @Output() output: EventEmitter<boolean> = new EventEmitter();
  registerForm: FormGroup;
  countries$: Observable<any[]>;
  avatar = 'https://p.kindpng.com/picc/s/303-3034310_avatar-icon-deadpool-png-download-deadpool-avatar-icon.png';
  idioma = [
    { name: 'Ingles (USA)', iso: 'en' },
    { name: 'Español (Latinoamerica)', iso: 'es' },
    { name: 'Portugues (Brasil)', iso: 'po' }
  ];

  constructor(
    private fb: FormBuilder,
    private db: DbUserService,
    private nav: NavController,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private masterService: MasterService,
    private loadingCtrl: LoadingController,
  ) {

  }

  ngOnInit() {
    this.loadForm();
    this.countries$ = this.db.getCountries();
  }

  onSubmit = async () => {
    const loading = await this.loadingCtrl.create({message: 'Salvando los Datos'});
    loading.present();
    this.db.registerUser(this.registerForm.value).subscribe(
      (res: any) => {
        this.db.refreshToken(res.token.refresh_token);
        loading.dismiss();
        this.registerForm.reset();
        this.nav.navigateRoot('user/register-company');
      },
      err => {
        loading.dismiss();
        this.messageAlert({
          header: 'Error', message: err.error.error,
          mode: 'ios', buttons: ['OK']
        });
        console.log(err.error);
      }
    );
  };

  loadForm = () => {
    this.registerForm = this.fb.group({
      language: ['en'],
      picture: [''],
      type_user: ['COMPANY'],
      phone: ['1242312312', Validators.required],
      country: [245, Validators.required],
      password: ['admin', Validators.required],
      email: ['av006@gmail.com', [Validators.required, Validators.email]],
      last_name: ['Velasques', [Validators.required, Validators.minLength(4)]],
      fist_name: ['Alejandro', [Validators.required, Validators.minLength(4)]],
    });
  };

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    this.avatar = image.dataUrl;
    this.registerForm.controls.picture.setValue(image.dataUrl);
  };

  messageAlert = async (item: any) => {
    const alert = await this.alertCtrl.create(item);
    await alert.present();
  };
}
