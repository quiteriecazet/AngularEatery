import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatToolbarModule, MatMenuModule, MatButtonModule, MatSidenav, MatSidenavModule, MatGridListModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, Router, NavigationExtras } from '@angular/router';
import { Restaurant } from './restaurant';
import { restaurantsList } from './restaurant';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MapsComponent } from '../app/components/maps/maps.component';
import { RestaurantsComponent } from '../app/components/restaurants/restaurants.component';
import { RestaurantDetailComponent } from '../app/components/restaurant-detail/restaurant-detail.component';
import { NotificationsComponent } from '../app/components/notifications/notifications.component';
import { AddRestaurantComponent } from '../app/components/add-restaurant/add-restaurant.component';
import { SelectedRestaurantsComponent } from '../app/components/selected-restaurants/selected-restaurants.component';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { MapService } from './services/map/map.service'
import { Observable, of } from 'rxjs';
import { Geolocation } from '../app/geolocation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  result: boolean;
  constructor(
    private translate: TranslateService,
    private geolocationService: GeolocationService,
    private mapService: MapService,
    private router: Router
  ) {
    translate.setDefaultLang('fr');
    translate.use('fr');
  }

  @ViewChild(MapsComponent)
  private mapsComponent: MapsComponent;
  sidenav: MatSidenav;
  currentUserPosition: Geolocation;
  geolocation;
  isGeolocated: boolean;
  selectedRestaurants;
  types = [];

  @Input() restaurantsList: Restaurant[];

  @Input() map;

  title = 'Eatery App';

  ngOnInit() {
    this.router.navigate(['']);
    this.geolocationService.getGeolocation(position =>
      this.displayGeolocation(position)
    );
    this.isGeolocated = true;
    this.getSelectedRestaurants();
  }

  onActivate($event) {
    console.log($event)
  }

  displayGeolocation = (position) => {
    this.mapsComponent.displayGeolocation(position)
  }


  getSelectedRestaurants(): void {
    this.mapService.getSelectedRestaurants().subscribe(selectedRestaurants => {
      this.selectedRestaurants = selectedRestaurants;
    });
    console.log(this.selectedRestaurants);
  }

  getAllTypes() {
    for (let i = 0; i < this.selectedRestaurants.length; i++) {
      this.types.push(this.selectedRestaurants[i].type);
    }
    this.types = this.types.filter((item, i, s) => s.lastIndexOf(item) === i);
  }

  displayRestaurants(param) {
    const navigationExtras: NavigationExtras = { fragment: param };
    this.router.navigate(['selected-restaurants'], navigationExtras);
  }

  modifyAddress(): void {
    // this.mapService.modifyAddress().subscribe(userAddress => {
    //   this.result = userAddress;
    // });
    this.mapService.modifyAddress().then((result) => {
      if (result) {
        this.isGeolocated = false;
      }
    })
  }

}


