/* eslint-disable ngrx/no-store-subscription */
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GestureController, NavController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Observable, timer } from 'rxjs';
import { ConnectService } from '@modules/chat/services/connect.service';
import { FireStorageService } from '@modules/chat/services/fire-storage.service';

@Component({
  selector: 'app-rooms-chat',
  templateUrl: 'rooms.page.html',
  styleUrls: ['rooms.page.scss'],
})
export class RoomsChatPage implements OnInit, AfterViewInit {

  @ViewChild('mic', { read: ElementRef }) mic: ElementRef;
  @ViewChild('recordBtn', { read: ElementRef }) recordBtn: ElementRef;
  public company: any = [];
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
    private photoViewer: PhotoViewer,
    private gestureCtrl: GestureController,
  ) {}

  ngOnInit() {
    VoiceRecorder.requestAudioRecordingPermission();
    this.active.params.subscribe(({uid}) => this.uid = uid);
  }

  ngAfterViewInit() {
    this.initChat(this.uid);
    this.initAudio();
    const longpress = this.gestureCtrl.create({
      threshold: 0, gestureName: 'long-press', el: this.recordBtn.nativeElement,
      onStart: ev => {
        Haptics.impact({ style: ImpactStyle.Light });
        this.startRecording();
        this.calculateDuration();
      },
      onEnd: ev => {
        Haptics.impact({ style: ImpactStyle.Light });
        this.stopRecording();
      },
    }, true);
    longpress.enable();
  }

  initChat(uid: any) {
    this.conn.createRoom(uid);
    this.items$ = this.conn.getRoomMessages(this.uid);
  }
  sendMessage() {
    if (this.message.length === 0) { return; }
    this.conn.sendRoomMessage(this.uid, this.message);
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

  // ----> VoiceRecord
  initAudio() { this.loadFiles(); }

  calculateDuration = () => {
    if(!this.recording) {
      this.duration = 0;
      this.durationDisplay = '';
      return;
    }
    this.duration += 1;
    const min = Math.floor(this.duration / 60);
    const sec = (this.duration % 60).toString().padStart(2, '0');
    this.durationDisplay = `${min}:${sec}`;
    timer(1000).subscribe(() => this.calculateDuration());
  };

  startRecording = () => {
    if (this.recording) { return; }
    this.recording = true;
    VoiceRecorder.startRecording();
  };

  stopRecording = () => {
    if (!this.recording) { return; }
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      this.recording = false;
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        console.log(recordData);
        const fileName = new Date().getTime() + '.wav';
        const url = await this.fs.uploadAudio(this.uid, fileName);
        this.conn.sendRoomMessage(this.uid, url, 'ACC', fileName);
        await Filesystem.writeFile({ path: fileName, directory: Directory.Data, data: recordData });
        this.loadFiles();
      }
    });
  };

  playFile = async (fileName: any) => {
    const audioFile = await Filesystem.readFile({ path: fileName, directory: Directory.Data, });
    const base64Sound = audioFile.data;
    const audioRef = new Audio(`data: audio/aac;base64,${base64Sound}`);
    console.log('SOUND ', audioRef);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  };

  loadFiles = async () => {
    Filesystem.readdir({ path: '', directory: Directory.Data })
      .then((result => this.storedFileNames = result.files));
  };

  // -----> Camera GET
  cameraGet = async () => {
    const image = await Camera.getPhoto({
      width: 600, height: 600, quality: 60, allowEditing: false, resultType: CameraResultType.DataUrl
    });
    const url = await this.fs.upload(this.uid, image.dataUrl);
    this.conn.sendRoomMessage(this.uid, url, 'IMG');
  };

  openPop = (url: string) => {
    this.openPopover = true;
    this.photoViewer.show(url, '',{ share: true });
  };
}
