import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { loadedCompany } from 'src/app/states/actions/company.actions';

@Component({
  selector: 'app-solicitud-modal',
  templateUrl: './solicitud-modal.component.html',
  styleUrls: ['./solicitud-modal.component.scss'],
})
export class SolicitudModalComponent implements OnInit {

  constructor(
    private store: Store<any>,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.store.select(loadedCompany).subscribe((res: any) => {
      console.log(res);
    })
  }

  onClose = () => this.modalCtrl.dismiss();

}
