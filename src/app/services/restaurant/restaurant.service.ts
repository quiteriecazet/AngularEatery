import { Injectable, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject, Subject} from 'rxjs';
import { RestaurantDetailComponent } from '../../components/restaurant-detail/restaurant-detail.component';
import { restaurantsList, Restaurant } from '../../restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  selectedRestaurants = restaurantsList;
  restaurant = new Subject<Object>();
  pickedRestaurant = this.restaurant.asObservable();

  constructor() { }

  
  public getSelectedRestaurants(): Observable<Restaurant[]> {
    return of(this.selectedRestaurants);
  }

  getRestaurantDetails(restaurant) {
    this.restaurant.next(restaurant);
  }

  addRestaurant(restaurant) {
    this.selectedRestaurants.push(restaurant);
  }
}
