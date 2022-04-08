import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NavController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Observable } from 'rxjs';
import { ConnectService } from '@modules/chat/services/connect.service';
import { FireStorageService } from '@modules/chat/services/fire-storage.service';
import { AppState } from '@store/app.state';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-rooms-chat',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss'],
})
export class RoomsChatPage implements OnInit, AfterViewInit {

  @ViewChild('mic', { read: ElementRef }) mic: ElementRef;
  public company: number;
  recording = false;
  messageToogle = false;
  storedFileNames = [];
  durationDisplay = '';
  duration: number;
  uid: any;
  message: string;
  toogleMessage = false;
  format = 'dd/MM HH:mm';
  items$: Observable<any[]>;
  photo: any;
  openPopover = false;

  constructor(
    private conn: ConnectService,
    private active: ActivatedRoute,
    private navCtrl: NavController,
    private fs: FireStorageService,
    private store: Store<AppState>,
    private photoViewer: PhotoViewer,
  ) { }

  ngOnInit() {
    this.active.params.subscribe(({uid}) => this.uid = uid);
  }

  ngAfterViewInit() {
    this.initChat(this.uid);

  }

  initChat(uid: any) {
    this.getCompany().subscribe(res => {
      this.company = res.id;
      this.items$ = this.conn.getMessagesServiceChat(res.id, uid);
      this.conn.readMessageServiceChat(res.id, uid).subscribe((res) => {});
      this.items$.subscribe(console.log);
      // this.items$ = this.conn.getRoomMessages(this.uid, res.id);
      // this.conn.createRoom(uid, res.company)
    });
  }
  sendMessage() {
    if (this.message.length === 0) { return; }
    this.conn.sendMessageServiceChat(this.uid, this.company, this.message);
    this.message = '';
    this.toogleMessage = false;
  }

  sendMessageKeypress(ev: any) {
    if (ev !== 13) { return; }
    this.sendMessage();
  }

  txtMessage() {
    if (this.message?.length === 0) { this.toogleMessage = false; }
    else { this.toogleMessage = true; }
  }

  logScrolling = (ev: any) => {
    // console.log(ev.detail);
  };

  onClose = () => this.navCtrl.navigateRoot('');

  // -----> Camera GET
  cameraGet = async () => {
    const image = await Camera.getPhoto({
      width: 600, height: 600, quality: 60, allowEditing: false, resultType: CameraResultType.DataUrl
    });
    const url = await this.fs.upload(this.uid, image.dataUrl);
    this.conn.sendMessageServiceChat(this.uid, this.company, url, 'IMG');
  };

  openPop = (url: string) => {
    this.openPopover = true;
    this.photoViewer.show(url, '',{ share: true });
  };

  private getCompany = () => {
    const company$ = this.store.select('company').pipe(
      filter((row: any) => !row.loading),
      map((res: any) => res.company)
    );
    return company$;
  }
}
