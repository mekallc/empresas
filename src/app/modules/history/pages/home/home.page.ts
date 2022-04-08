import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  toogle = 'CLOSED';
  constructor() {}

  segmentChanged = (ev: any) => this.toogle = ev.detail.value;
}
