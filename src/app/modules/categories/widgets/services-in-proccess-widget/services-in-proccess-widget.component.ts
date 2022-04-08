import { Component, AfterViewInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AppState } from '@store/app.state';
import { ConnectService } from '@modules/chat/services/connect.service';
import { WaitingComponent } from '@modules/categories/pages/waiting/waiting.component';

@Component({
  selector: 'app-services-in-proccess-widget',
  templateUrl: './services-in-proccess-widget.component.html',
  styleUrls: ['./services-in-proccess-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ServicesInProccessWidgetComponent implements AfterViewInit {

  @Input() code: number;

  unread: any;
  company: any;
  offline: boolean;
  companyId = 0;
  items$: Observable<any>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private modalCtrl: ModalController,
    private chatService: ConnectService,
  ) { }

  ngAfterViewInit(): void {
    this.getServiceAcceptedWithChat();
    this.store.select('status').subscribe((res: any) => this.offline = res.id);

  }

  getServiceAcceptedWithChat = () => {
    this.items$ = this.store.select('accepted')
    .pipe(
      filter(row => !row.loading),
      map((res: any) =>
        this.chatService.unReadMessageServiceChat(this.code, res.accepted).slice(0,3))
    );
  }

  openModal = async (res: any) => {
    const modal = await this.modalCtrl.create({
      component: WaitingComponent, componentProps: { res, company: this.code } });
    await modal.present();
  };

  openChat = (code: any) => this.router.navigate(['chat', 'room', code]);
}
