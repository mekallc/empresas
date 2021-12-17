import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services-open-widget',
  templateUrl: './services-open-widget.component.html',
  styleUrls: ['./services-open-widget.component.scss'],
})
export class ServicesOpenWidgetComponent implements OnInit {

  options = {
    slidesPerView: 2.2,
    spaceBetween: 10,
    freeMode: true
  };

  constructor() { }

  ngOnInit() {}

}
