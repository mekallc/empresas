import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AppState } from '@store/app.state';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  expert: any = [];
  items$: Observable<any>;
  loading = true;

  constructor(
    private store: Store<AppState>,
    private modalCrtl: ModalController,
  ) {}
  ngOnInit(): void {
    this.getServices();
  }


  getServices = () => {
    this.items$ = this.store.select('history').pipe(
      filter((row) => !row.loading),
      map((res) => res.history),
      map((res: any) => {
        const data: any = [];
        res.forEach((el: any) => {
          el.icon = this.getIcone(el.type_expert);
          data.push(el);
        });
        return data;
      })
    );
  }

  doRefresh = (ev: any) => {
    setTimeout(() => {
      this.getServices();
      ev.target.complete()
    }, 1500);
  };

  openService = async (res: any) => {
    const modal = await this.modalCrtl.create({
      component: WaitingComponent,
      componentProps: { res }
    });
    modal.present();
  };

  getIcone = (item: any) =>{
    let data: string;
    const expert$ = this.store.select('expert')
    .pipe(
      filter((row) => !row.loading),
      map((res) => res.items),
      map((res: any) => {
        const fill = res.filter(data => data.name === item)[0].picture.toString();
        return fill;
      })
    );
    expert$.subscribe(res => data = res);
    return data;
  }
}
