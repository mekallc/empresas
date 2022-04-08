import { Component, AfterViewInit, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, zip } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AppState } from '@store/app.state';
import { MasterService } from '@core/services/master.service';
import { SolicitudModel } from '@core/model/solicitud.interfaces';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';


@Component({
  selector: 'app-solicitud-modal',
  templateUrl: './solicitud-modal.component.html',
  styleUrls: ['./solicitud-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudModalComponent implements OnInit {

  entry$: Observable<any[]>;
  items: any = [];

  constructor(
    private ms: MasterService,
    private store: Store<AppState>,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  openService = async (res: any) => {
    this.onClose();
    const modal = await this.modalCtrl.create({
      component: WaitingComponent,
      componentProps: { res }
    });
    modal.present();
  };


  loadData = () => {
    this.entry$ = this.store.select('solicitud')
    .pipe(
      filter(row => !row.loading),
      map((res: any) => res.solicitud),
      switchMap((res) => this.constructData(res))
    );
  }

  private constructData = (items: any) => {
    const service: any = items;
    return this.ms.getMaster('master/expert/').pipe(
      map((res: any) => {
        const data: any = [];
        service.forEach((el: any) => {
          const filter = res.filter((row: any) => row.name === el.type_expert)[0].picture.toString();
          el.icon_expert = (filter);
          data.push(el);
        });
        return data;
      })
    )
  };


  onClose = () => this.modalCtrl.dismiss();

}
