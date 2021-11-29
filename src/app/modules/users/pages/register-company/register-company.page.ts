import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MasterService } from '@core/services/master.service';
import { StorageService } from '@core/services/storage.service';
import { DbUserService } from '@modules/users/services/db-user.service';
import { tap } from 'rxjs/operators';
import { MapsWidgetComponent } from './../../widgets/maps/maps.component';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.page.html',
  styleUrls: ['./register-company.page.scss'],
})
export class RegisterCompanyPage implements OnInit {

  @Input() modal = false;
  @Output() output: EventEmitter<boolean> = new EventEmitter();
  factoryForm: FormGroup;
  experts$: Observable<any[]>;
  countries$: Observable<any[]>;
  countries: any = [];
  yenny: any;
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

  async ngOnInit() {
    this.loadForm();
    const user = await this.storage.getStorage('user');
    this.db.refreshToken(user.token.refresh_token).subscribe(() => {});
    console.log('38 ', user.token.refresh_token);
    this.experts$ = this.db.getCategories();
    this.countries$ = this.db.getCountries();
    this.countries$.subscribe((res) => this.countries = res);
    this.setAddress();
  }

  onSubmit = async (id: number) => {
    const loading = await this.loadingCtrl.create({ message: 'Loading...' });
    await loading.present();
    const data= this.parseData(this.factoryForm.value);
    const token = await this.storage.getStorage('token');
    console.log(token);
    console.log(data);
    this.yenny = data;
    this.db.registerCompany(data, token).subscribe(
      async (res) => {
        console.log('NEW COMPANY ', res);
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Se creo tu Empresa.',
          duration: 2000, mode: 'ios'
        });
        await toast.present();
        if (this.modal) {
          this.onClose();
        } else {
          this.nav.navigateRoot('pages/companies');
        }
      },
      err => {
        loading.dismiss();
        console.log(err);
      }
    );
  };


  loadForm = () => {
    this.factoryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      type_expert: ['', Validators.required],
      country: ['', Validators.required],
      zip_code: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required],
      num: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      complement: [''],
    });
  };

  onMaps = async () => {
    const modal = await this.modalCtrl.create({ component: MapsWidgetComponent });
    await modal.present();
  };

  alertMessage = async (header: string, message: string) => {
    const alert = await this.alertCtrl.create(({ header, message, mode: 'ios', buttons: ['Ok'] }));
    await alert.present();
  };

  onClose = () => this.modalCtrl.dismiss();

  private setAddress = () => {
    this.db.getAddress$().subscribe((res: any) => {
      if (res) {
        this.setCountry(res.country);
        const value = this.factoryForm.controls;
        value.num.setValue(res.num);
        value.city.setValue(res.city);
        value.state.setValue(res.state);
        value.zip_code.setValue(res.zip);
        value.street.setValue(res.street);
        value.district.setValue(res.district);
        value.latitude.setValue(res.latitude);
        value.longitude.setValue(res.longitude);
      }
    });
  };

  private setCountry = (country: string) => {
    this.db.getCountriesName(country).subscribe((res: any) => {
      if(res.search.length > 0) {
        const data = res.search[0];
        this.factoryForm.controls.country.setValue(data.id);
      } else {
        this.alertMessage('Error', 'Pais no disponible');
        this.factoryForm.controls.num.reset();
        this.factoryForm.controls.city.reset();
        this.factoryForm.controls.state.reset();
        this.factoryForm.controls.street.reset();
        this.factoryForm.controls.street.reset();
        this.factoryForm.controls.district.reset();
        this.factoryForm.controls.zip_code.reset();
      }
    });
  };

  private parseData = (value: any) => {
    const data: any = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      type_expert: value.type_expert,
      address: {
        country: `${value.country}`, zip_code: value.zip_code,
        state: value.state, city: value.city, district: value.district,
        street: value.street, num: value.num,
        latitude: `${value.latitude}`, longitude: `${value.longitude}`
      }
    };
    return data;
  };

}
