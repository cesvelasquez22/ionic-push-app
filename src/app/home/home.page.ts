import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal';
import { PushService } from '../services/push.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notifications: OSNotificationPayload[] = [];

  constructor(
    private pushService: PushService,
    private storage: StorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pushService.notificationListener.subscribe((notification) => {
      this.notifications.unshift(notification);
      this.changeDetectorRef.detectChanges();
    });
  }

  ionViewWillEnter() {
    this.notifications = this.storage.notifications;
  }
}
