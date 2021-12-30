import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '@modules/users/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
})
export class EditarComponent implements OnInit {
  @Input() user: any;
  registerForm: FormGroup;
  countries$: Observable<any[]>;
  idioma = [
    { name: 'Ingles (USA)', iso: 'en' },
    { name: 'Portugues (Brasil)', iso: 'po' },
    { name: 'Español (Latinoamerica)', iso: 'es' },
  ];

  constructor(
    private db: AuthService,
    private fb: FormBuilder,
    private ms: MasterService,
    private nav: NavController,
    private storage: StorageService,
    private loadCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.loadForm();
    this.countries$ = this.ms.getMaster('master/countries/');
  }

  onSubmit = async () => {
    console.log(this.user);
    console.log(this.registerForm.value);
    // if(this.registerForm.invalid) { return; }
    const load = await this.loadCtrl.create({message: 'Loading...'});
    load.present();
    this.db.updateUser(this.registerForm.value).subscribe(
      async (res: any) => {
        await load.dismiss();
        this.nav.navigateRoot('');
        await this.storage.setStorage('userCompany', res);
      }
    );
  };

  loadForm = () => {
    this.registerForm = this.fb.group({
      phone: [''],
      country: [''],
      fist_name: [''],
      last_name: [''],
    });
  };
}
