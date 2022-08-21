import { EventEmitter, Injectable } from '@angular/core';
import {
  OneSignal,
  OSNotification,
  OSNotificationPayload,
} from '@awesome-cordova-plugins/onesignal/ngx';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  public notificationListener = new EventEmitter<OSNotificationPayload>();
  constructor(private oneSignal: OneSignal, private storage: StorageService) {}

  initOneSignal() {
    this.oneSignal.startInit(
      '1688145f-59fe-4fb3-9fb0-c746e421a8a4',
      '291395690906'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );

    this.oneSignal.handleNotificationReceived().subscribe((notification) => {
      // do something when notification is received
      console.log('Notification received', notification);
      this.nextNotificationReceived(notification);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (notification) => {
      // do something when a notification is opened
      console.log('Notification opened', notification);
      await this.nextNotificationReceived(notification.notification);
    });

    this.oneSignal.endInit();
  }

  async nextNotificationReceived(notification: OSNotification) {
    await this.storage.loadNotifications();
    const payload = notification.payload;
    const existingMessage = !!this.storage.notifications.find(
      (message) => message.notificationID === payload.notificationID
    );
    if (!existingMessage) {
      await this.storage.setNotification(payload);
      this.notificationListener.emit(payload);
    }
  }
}
