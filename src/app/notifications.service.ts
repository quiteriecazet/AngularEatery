import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  notifications: string[] = [];

  add(notification: string) {
    this.notifications.push(notification);
  }

  clear() {
    this.notifications = [];
  }
}
