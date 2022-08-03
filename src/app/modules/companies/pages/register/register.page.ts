import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from '@store/app.state';
import { loadCompany } from '@store/actions';
import { MapsWidgetComponent } from './../../widgets/maps/maps.component';
import { DbCompaniesService } from './../../services/db-companies.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit, AfterViewInit {
  @Input() item: any;
  @Input() modal = false;
  @Output() output: EventEmitter<boolean> = new EventEmitter();
  factoryForm: FormGroup;
  types$: Observable<any[]>;
  company$: Observable<any[]>;
  companyExist: boolean;
  experts$: Observable<any[]>;
  countries$: Observable<any[]>;
  countries: any = [];
  yenny: any;
  count$: Observable<number>;
  address: any;

  constructor(
    private fb: FormBuilder,
    private nav: NavController,
    private db: DbCompaniesService,
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    this.loadForm();
    this.types$ = this.db.getType();
    this.experts$ = this.db.getCategories();
    this.countries$ = this.db.getCountries();
    this.setAddress();
    this.countries$.subscribe((res) => this.countries = res);
    this.count$ = this.store.select('company').pipe(map((res: any) => res.company?.length));
  }

  ngAfterViewInit(): void {
    this.getAction();
  }

  getAction = () => {
    this.company$ = this.store.select('company').pipe(filter(row => !row.loading), map((res: any) => res.company));
    this.company$.subscribe((res: any) => {
      if(res) {
        this.factoryForm.controls.id.setValue(res.id);
        this.companyExist = res.id ? true: false;
        this.editLayout(res);
      }
    });
  }

  roundNumber = (num = 0) => num.toFixed(4);
  onSubmit = async () => {
    const loading = await this.loadingCtrl.create({ message: 'Loading...' });
    await loading.present();
    const data= this.parseData(this.factoryForm.value);
    this.yenny = data;
    if(this.companyExist) {
      await loading.dismiss();
      this.db.updateCompany(this.factoryForm.value.id, data).subscribe(
        async (res) => {
          this.store.dispatch(loadCompany());
          await loading.dismiss();
          this.setMessage({ message: 'Company edited.', duration: 2000, mode: 'ios' });
        },
        async (err: any) => {
          loading.dismiss();
          this.setMessageError();
        }
      );
    } else {
      this.db.registerCompany(data).subscribe(
        async (res) => {
          this.store.dispatch(loadCompany());
          await loading.dismiss();
          this.setMessage({ message: 'Company created.', duration: 2000, mode: 'ios' });
        },
        async (err: any) => {
          loading.dismiss();
          this.setMessageError();
        }
      );
    }
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
      id: [''],
      longitude: [''],
      complement: [''],
      identity: ['S/N'],
      type_company: ['', Validators.required],
    });
  };

  // onMaps = async () => {
  //   const modal = await this.modalCtrl.create(
  //     {
  //       mode:'ios',
  //       initialBreakpoint: 1,
  //       breakpoints: [0, 1],
  //       component: MapsWidgetComponent,
  //     }
  //     );
  //   await modal.present();
  // };

  onMaps = () => {
    this.nav.navigateRoot('/pages/companies/mapa');
  }

  alertMessage = async (header: string, message: string) => {
    const alert = await this.alertCtrl.create( { header, message, mode: 'ios', buttons: ['Ok'] });
    await alert.present();
  };

  onClose = () => this.modalCtrl.dismiss();

  private setMessage = async (options: any): Promise<void> => {
    const toast = await this.toastCtrl.create(options);
    await toast.present();
    if (this.modal) { this.onClose(); }
    else { this.nav.navigateRoot(''); }
  };

  private setMessageError = async (): Promise<void> => {
    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Error',
      message: 'Algo errado paso!, intenta de nuevo',
      buttons: ['Ok']
    });
    alert.present();
  };

  editLayout = (item: any) => {
    console.log(item);
    this.setCompany(item.type_company);
    this.setEditCategories(item.type_expert);
    this.setEditCountry(item.address[0].country);
    this.factoryForm.controls.name.setValue(item.name);
    this.factoryForm.controls.phone.setValue(item.phone);
    this.factoryForm.controls.email.setValue(item.email);
    this.factoryForm.controls.state.setValue(item.address[0].state);
    this.factoryForm.controls.city.setValue(item.address[0].city);
    this.factoryForm.controls.street.setValue(item.address[0].street);
    this.factoryForm.controls.district.setValue(item.address[0].district);
    this.factoryForm.controls.num.setValue(item.address[0].num);
    this.factoryForm.controls.complement.setValue(item.address[0].complement);
    this.factoryForm.controls.latitude.setValue(item.address[0].latitude);
    this.factoryForm.controls.longitude.setValue(item.address[0].longitude);
    this.factoryForm.controls.zip_code.setValue(item.address[0].zip_code);
  };

  private setCompany = (name: string) => {
    const value = name.toLowerCase();
    const item$ = this.types$.pipe(
      map((res: any) => {
      const fill = res.filter((row: any) =>
        row.name.toLowerCase() === value)[0];
      return fill.id;
    }));
    item$.subscribe(id => this.factoryForm.controls.type_company.setValue(id));
  };

  private setAddress = () => {
    this.db.getAddress$().subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.address = res;
        const value = this.factoryForm.controls;
        value.latitude.setValue(res.lat);
        value.longitude.setValue(res.lng);
      }
    });
  };

  private setEditCountry = (name: string) => {
    const value = name.toLowerCase();
    const item$ = this.countries$.pipe(
      map((res: any) => {
      const fill = res.filter((row: any) =>
        row.name.toLowerCase() === value)[0];
      return fill.id;
    }));
    item$.subscribe(id => this.factoryForm.controls.country.setValue(id));
  };

  private setEditCategories = (categories: any) => {
    let data = [];
    console.log(categories);
    categories.forEach((el: any) => {
      const value = el.toLowerCase();
      console.log(value);
      this.experts$.pipe(
        map((res: any) => {
        const fill = res.filter((row: any) =>
          row.name.toLowerCase() === value)[0];
        return fill.id;
      }))
      .subscribe(id => data.push(id));
    });
    this.factoryForm.controls.type_expert.setValue(data)
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
      type_company: value.type_company,
      address: {
        country: `${value.country}`, zip_code: value.zip_code,
        state: value.state, city: value.city, district: value.district,
        street: value.street, num: value.num,
        latitude: `${value.latitude}`, longitude: `${value.longitude}`
      },
      identity: 'null'
    };
    return data;
  };

}
