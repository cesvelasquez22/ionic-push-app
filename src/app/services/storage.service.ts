import { EventEmitter, Injectable } from '@angular/core';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  public notificationEvent = new EventEmitter<void>();
  private _storage: Storage | null = null;
  private _localNotifications: OSNotificationPayload[] = [];
  private readonly NOTIFICATIONS_KEY = 'notifications';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadNotifications();
  }

  async loadNotifications() {
    try {
      const notifications = await this._storage.get(this.NOTIFICATIONS_KEY);
      this._localNotifications = notifications || [];
    } catch (error) {
      console.error(error);
    }
  }

  get notifications() {
    return [...this._localNotifications];
  }

  existsNotification(notification: OSNotificationPayload) {
    return new Promise<boolean>((resolve, reject) => {
      this._localNotifications.some((localNotification) => {
        if (localNotification.notificationID === notification.notificationID) {
          resolve(true);
        }
      });
      reject(false);
    });
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public remove(key: string) {
    return this._storage?.remove(key);
  }

  public async setNotification(notification: OSNotificationPayload) {
    this._localNotifications.unshift(notification);
    return await this.set(this.NOTIFICATIONS_KEY, this._localNotifications);
  }

  public async clearNotifications() {
    await this.remove(this.NOTIFICATIONS_KEY);
    await this.loadNotifications();
  }
}
