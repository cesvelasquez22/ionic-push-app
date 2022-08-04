import { Injectable } from '@angular/core';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  constructor(private oneSignal: OneSignal) {}

  initOneSignal() {
    this.oneSignal.startInit(
      '1688145f-59fe-4fb3-9fb0-c746e421a8a4',
      '291395690906'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.InAppAlert
    );

    this.oneSignal.handleNotificationReceived().subscribe((notification) => {
      // do something when notification is received
      console.log('Notification received', notification);
    });

    this.oneSignal.handleNotificationOpened().subscribe((notification) => {
      // do something when a notification is opened
      console.log('Notification opened', notification);
    });

    this.oneSignal.endInit();
  }
}
