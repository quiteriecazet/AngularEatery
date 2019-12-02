import { Component, OnInit, AfterViewInit, Input, AfterContentInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatToolbarModule, MatMenuModule, MatButtonModule, MatSidenav, MatGridListModule, MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, Router, NavigationExtras } from '@angular/router';
import { Restaurant } from './restaurant';
import { restaurantsList } from './restaurant';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MapsComponent } from '../app/components/maps/maps.component';
import { RestaurantsComponent } from '../app/components/restaurants/restaurants.component';
import { RestaurantDetailComponent } from '../app/components/restaurant-detail/restaurant-detail.component';
import { AddRestaurantComponent } from '../app/components/add-restaurant/add-restaurant.component';
import { SelectedRestaurantsComponent } from '../app/components/selected-restaurants/selected-restaurants.component';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { MapService } from './services/map/map.service'
import { RestaurantService } from './services/restaurant/restaurant.service'
import { Observable, of } from 'rxjs';
import { Geolocation } from '../app/geolocation';
import { LegalMentionsSheet } from './dialogs/legal-mentions-dialog/legal-mentions-dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  result: boolean;
  userPosition: google.maps.LatLng;
  isOpen: boolean;
  constructor(
    private translate: TranslateService,
    private geolocationService: GeolocationService,
    private mapService: MapService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private restaurantService: RestaurantService
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
    this.isOpen = false;
    this.router.navigate(['']);
    this.mapsComponent.setGeolocation();
    this.isGeolocated = true;
    this.getSelectedRestaurants();
  }

  ngAfterViewInit() {
    this.isOpen = false;
    this.router.navigate(['']);
    this.mapsComponent.setGeolocation();
    this.isGeolocated = true;
    this.getSelectedRestaurants();
  }

  onActivate($event) {
  }

  getSelectedRestaurants(): void {
    this.restaurantService.getSelectedRestaurants().subscribe(selectedRestaurants => {
      this.selectedRestaurants = selectedRestaurants;
    });
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
    this.mapService.modifyAddress().then((result) => {
      if (result) {
        this.isGeolocated = false;
      }
    })
  }

  setGeolocation() {
    this.mapsComponent.setGeolocation().subscribe(position =>
      this.isGeolocated = true);
  }

  openLegalMentions(): void {
    this._bottomSheet.open(LegalMentionsSheet)
  }

  displayRouterView(): void {
    this.isOpen = true;
    console.log(this.isOpen)
  }
}


