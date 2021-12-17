import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DbCompaniesService } from './../../services/db-companies.service';
import { RegisterPage } from './../register/register.page';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  active = true;
  content = ['Perfil', 'Compañias', 'Mensajes'];
  subContent = ['Central de Ayuda', 'Política de Privacidad', 'Terminos de Uso', 'Sobre Meka', 'Evalua App'];
  total = 0;
  lists$: Observable<any>;

  constructor(
    private db: DbCompaniesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.lists$ = this.db.getCompanies().pipe(tap((res: any) => this.total = res.length));
    this.lists$.subscribe((res) => console.log(res));
    console.log(this.total);
  }

  onRegister = async () => {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      componentProps: { modal: true }
    });
    await modal.present();
  };
}
