import { Injectable } from '@angular/core';
import {
  OneSignal,
  OSNotification,
  OSNotificationPayload,
} from '@awesome-cordova-plugins/onesignal/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private _pushReceived = new BehaviorSubject<OSNotificationPayload[]>([]);
  public pushReceived$ = this._pushReceived.asObservable();
  public messages: any[] = [
    {
      title: 'Notification 1',
      body: 'This is the body of notification 1',
      date: new Date(),
    },
  ];
  constructor(private oneSignal: OneSignal) {}

  get pushReceived() {
    return this._pushReceived.value;
  }

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

    this.oneSignal.handleNotificationOpened().subscribe((notification) => {
      // do something when a notification is opened
      console.log('Notification opened', notification);
    });

    this.oneSignal.endInit();
  }

  nextNotificationReceived(notification: OSNotification) {
    // this._pushReceived.next(notification);
    const payload = notification.payload;
    const existingMessage = !!this.messages.find(
      (message) => message.notificationID === payload.notificationID
    );
    if (!existingMessage) {
      // this.messages.unshift(payload);
      this._pushReceived.next([payload, ...this.pushReceived]);
    }
  }
}
