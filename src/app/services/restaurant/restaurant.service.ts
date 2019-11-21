import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subject} from 'rxjs';
import { RestaurantDetailComponent } from '../../components/restaurant-detail/restaurant-detail.component';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  restaurant = new Subject<Object>();

  pickedRestaurant = this.restaurant.asObservable();

  constructor() { }

  getRestaurantDetails(restaurant) {
    this.restaurant.next(restaurant);
  }
}
