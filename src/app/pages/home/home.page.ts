import { Component, OnInit } from '@angular/core';
import { MasterService } from '@core/services/master.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private ms: MasterService
  ) {}

  ngOnInit(): void {
    this.ms.getMaster('user/company/').subscribe((res) => console.log(res));
  }
}
