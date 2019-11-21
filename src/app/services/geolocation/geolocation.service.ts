import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Geolocation } from '../../geolocation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private userPosition = new BehaviorSubject<Geolocation>({lat: 0, lng: 0});
  currentUserPosition = this.userPosition.asObservable();
  position;
  constructor() { }


  public getGeolocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        callback(position);
      })
    } else {
      return null;
    }
  }

}
