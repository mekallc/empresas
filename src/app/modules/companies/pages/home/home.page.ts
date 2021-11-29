import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DbCompaniesService } from '@modules/companies/services/db-companies.service';
import { RegisterCompanyPage } from '@modules/users/pages/register-company/register-company.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  active = true;
  content = ['Perfil', 'Compañias', 'Mensajes'];
  subContent = ['Central de Ayuda', 'Política de Privacidad', 'Terminos de Uso', 'Sobre Meka', 'Evalua App'];

  lists$: Observable<any>;

  constructor(
    private db: DbCompaniesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.lists$ = this.db.getCompanies();
    this.lists$.subscribe((res) => console.log(res));
  }

  onRegister = async () => {
    const modal = await this.modalCtrl.create({
      component: RegisterCompanyPage,
      componentProps: { modal: true }
    });
    await modal.present();
  };
}
