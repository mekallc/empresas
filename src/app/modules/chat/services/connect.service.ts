/* eslint-disable ngrx/no-store-subscription */
/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, docData, setDoc, Timestamp,
  orderBy, query, collectionData, where, updateDoc } from '@angular/fire/firestore';
  import { Observable } from 'rxjs';
  import { catchError, take, tap } from 'rxjs/operators';
  import { StorageService } from '@core/services/storage.service';
  import { Store } from '@ngrx/store';
  import { selectCompanyList } from 'src/app/states/selector/company.selector';
import { runInThisContext } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {

  id = 0;
  private company: any;
  constructor(
    private store: Store,
    private fs: Firestore,
    private storage: StorageService,
  ) {
    this.setCompany();
  }

  createMessageId = (user: any) => {
    delete user.access;
    delete user.refresh;
    const soporteRef = doc(this.fs, `soporte/${user.email}`);
    setDoc(soporteRef, user);
    const messageRef = collection(this.fs, `soporte/${user.email}/message`);
    return addDoc(messageRef, {
      type: 'AD', status: 'SENT', name: 'Administrator',
      message: `Hola ${user.fist_name}, me indica en que puedo ayudar`,
      createdAt: Timestamp.fromMillis(new Date().getTime())
    });
  };

  getMessages(id = 'cliente01@gmail.com'): Observable<any[]> {
    return collectionData(
      query(collection(this.fs, `soporte/${id}/message`), orderBy('createdAt')),
      { idField: 'id' }
    ) as Observable<any[]>;
  }

  getChatId = (id: string) => docData(doc(this.fs, `soporte/${id}`), { idField: 'id'}) as Observable<any>;

  sendMessage = (id: string, message: string) => {
    this.id = this.id + 1;
    const data = {
      message,
      type: 'USER',
      status: 'SENT',
      createdAt: Timestamp.fromMillis(new Date().getTime())
    };
    const messageRef = collection(this.fs, `soporte/${id}/message`);
    return addDoc(messageRef, data);
  };

  readMessage(id = 'cliente01@gmail.com') {
    return collectionData(
      query(
        collection(this.fs, `soporte/${id}/message`),
        where('status', '==', 'SENT'),
        where('type', '==', 'ADMIN')
      ),
      { idField: 'id' }
    ).pipe(
      tap((res: any) => {
        res.forEach(el => this.changeStatusMessage(id, el.id));
      })
    ) as Observable<any[]>;
  };

  changeStatusMessage(id: string, uid: string) {
    const msgDocRef = doc(this.fs, `soporte/${id}/message/${uid}`);
    return updateDoc(msgDocRef, { status: 'READ' });
  }

  // ROOM
  createRoom = (uid: any) => {
    console.log(this.company.id);
    setDoc(doc(this.fs, `rooms/chat/${uid}/${this.company.id}`), this.company);
    // updateDoc(doc(this.fs, 'rooms', `rooms/${uid}`, `${this.company.id}`), this.company);
  };

  getRoomMessages(uid: string): Observable<any[]> {
    return collectionData(
      query(
        collection(this.fs, `rooms/chat/${uid}/${this.company.id}/messages`),
        orderBy('createdAt')
      ),
      { idField: 'id' }
    ) as Observable<any[]>;
  }

  sendRoomMessage = (uid: string, message: any, input = 'TEXT', name = '') => {
    const data = {
      message, type: 'LT', status: 'SENT', input, name,
      createdAt: Timestamp.fromMillis(new Date().getTime())
    };
    return addDoc(
      collection(this.fs, `rooms/chat/${uid}/${this.company.id}/messages`)
      , data);
  };

  setCompany() {
    this.store.select(selectCompanyList).subscribe((res) => this.company = res);
  }
}
