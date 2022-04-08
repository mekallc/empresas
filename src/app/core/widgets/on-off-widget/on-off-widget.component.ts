import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.state';

@Component({
  selector: 'app-on-off-widget',
  templateUrl: './on-off-widget.component.html',
  styleUrls: ['./on-off-widget.component.scss'],
})
export class OnOffWidgetComponent implements AfterViewInit {

  offline: boolean;

  constructor(
    private store: Store<AppState>,
  ) { }

  ngAfterViewInit(): void {
    this.store.select('status').subscribe((res: any) => {
      this.offline = res.id;
    })
  }

}
