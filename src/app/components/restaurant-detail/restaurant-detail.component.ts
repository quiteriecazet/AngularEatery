import { Component, OnInit, Input, HostBinding, OnDestroy } from '@angular/core';
import { Restaurant, restaurantsList } from '../../restaurant';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule, MatChipsModule } from '@angular/material';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {

  @Input('selectedRestaurant') restaurant;
  subscription: Subscription;

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute, private readonly _translate: TranslateService) {
    this.subscription = restaurantService.restaurant.subscribe(
      restaurant => {
        this.restaurant = restaurant;
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
