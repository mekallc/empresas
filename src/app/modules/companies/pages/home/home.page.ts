import { ModalController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DbCompaniesService } from './../../services/db-companies.service';
import { RegisterPage } from './../register/register.page';
import { tap, takeUntil } from 'rxjs/operators';
import { StorageService } from '@core/services/storage.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  active = true;
  content = ['Perfil', 'Compañias', 'Mensajes'];
  subContent = ['Central de Ayuda', 'Política de Privacidad', 'Terminos de Uso', 'Sobre Meka', 'Evalua App'];
  total = 0;
  lists$: Observable<any>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private db: DbCompaniesService,
    private storage: StorageService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    this.lists$ = this.db.getCompanies().pipe(
      tap((res: any) => this.total = res.length)
    );
    this.lists$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      async (res: any) => {
        await this.storage.setStorage('company', res);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRegister = async () => {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      componentProps: { modal: true }
    });
    await modal.present();
  };
}
