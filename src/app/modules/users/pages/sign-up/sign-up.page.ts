import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit, AfterViewInit {

  @ViewChild('slides') slides: IonSlides;
  activeIndex = 0;
  registerForm: FormGroup;
  factoryForm: FormGroup;
  avatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  idioma = [
    { name: 'Ingles (USA)', iso: 'en' },
    { name: 'Español (Latinoamerica)', iso: 'es' },
    { name: 'Portugues (Brasil)', iso: 'po' }
  ];

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };


  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  }

  loadForm = () => {
    this.registerForm = this.fb.group({
      language: ['en'],
      picture: [this.avatar],
      type_user: ['COMPANY'],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lastname: ['', [Validators.required, Validators.minLength(4)]],
      firstname: ['', [Validators.required, Validators.minLength(4)]],
    });
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
      number1: [''],
      complement: [''],
    });
  };

  stepTo = (id: number) => {
    this.activeIndex = id + 1;
    this.slides.lockSwipes(false);
    this.slides.slideTo(id);
    this.slides.lockSwipes(true);
  };
}
