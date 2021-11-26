import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DbCompaniesService } from './../../services/db-companies.service';

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
    private db: DbCompaniesService
  ) {}

  ngOnInit(): void {
    this.lists$ = this.db.getCompanies();
    this.lists$.subscribe((res) => console.log(res));
  }
}
