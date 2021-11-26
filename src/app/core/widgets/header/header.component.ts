import { NavController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() link: string;
  @Input() position = 'end';
  content = 0;

  constructor(
    private nav: NavController
  ) { }

  ngOnInit() {}

  onNotification = () => console.log('onNotification');
  onMenu = (item: string) => this.nav.navigateRoot(item);
}
