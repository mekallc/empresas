import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

import { MasterService } from '@core/services/master.service';


@Injectable({
  providedIn: 'root'
})
export class PushService {
  constructor(
    private router: Router,
    private ms: MasterService,
    private platform: Platform,
    private storage: StorageService
    ) { }


  initPush = async () => {
    this.registerNotifications();
    this.addListeners();
    this.getDeliveredNotifications();
  }

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  addListeners = async () => {
    await PushNotifications.addListener('registration', async (token: any) => {
      await this.storage.setStorage('push', token.value);
      await this.updateToken(token);
    });
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  updateToken = async (token: any)=>{
    const push = await this.storage.getStorage('push');
    if(push !== token) {
      this.ms.changeToken(token.value).subscribe((res) => {});
    }
  }
}
