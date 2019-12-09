import { Component, OnInit, Input, AfterViewInit, ViewChild, NgZone, HostListener, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Restaurant } from '../../restaurant';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { MapService } from '../../services/map/map.service';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatCardModule, MatListModule, MatDividerModule, MatInputModule, MatSidenavModule, MatButtonToggleModule,
  MatExpansionModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatChipsModule, MatToolbarModule, MatDialogModule,
  MatTooltipModule
} from '@angular/material';
import { apiKey } from '../../app.module';
import { MapsComponent } from '../maps/maps.component';
import { RestaurantDetailComponent } from '../restaurant-detail/restaurant-detail.component';
import { } from 'googlemaps';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})

export class RestaurantsComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MapsComponent)
  private mapsComponent: MapsComponent;
  place: any;
  lat: number;
  lng: number;
  results: { forEach: (arg0: (item: any) => void) => void; };
  mapLocation: { lat: number; lng: number; };
  input: any;
  position: { lat: any; lng: any; };
  marker;
  distance: any;
  previousMarker: { setIcon: () => void; };
  markers: any = [];
  placeResults: any;
  showDetails = false;
  bounds;
  map;
  photo;
  service;
  selectedRestaurant;
  inputRestaurant;
  autocomplete;
  inputResult: any;
  value: string;
  options = {
    types: ['establishment']
  };
  userPosition: google.maps.LatLng;
  subscription: any;
  constructor(private restaurantService: RestaurantService, private mapService: MapService,
    private geolocationService: GeolocationService, private route: ActivatedRoute,
    private _ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.map = this.mapService.getMap();
    this.subscription = this.mapService.getLatLngPosition().subscribe(position => {
      this.userPosition = position;
    });
    this.map.setCenter(this.userPosition);
    this.service = new google.maps.places.PlacesService(this.map);
    this.bounds = new google.maps.LatLngBounds();
    this.activateAutocomplete();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  activateAutocomplete() {
    this.inputRestaurant = document.getElementById('restaurantLocation');
    this.autocomplete = new google.maps.places.Autocomplete(this.inputRestaurant, this.options);
    this.autocomplete.addListener('place_changed', () => {
      this.inputResult = this.autocomplete.getPlace();
      if (this.inputResult.geometry) {
        this.showDetails = true;
        this.selectedRestaurant = this.inputResult;
        this.value = '';
        this.displaySelectedRestaurant();
      }
    });
  }

  searchAround(mapLocation) {
    this.mapService.clearMap();

    if (!this.map) {
      this.ngAfterViewInit();
    }

    if (!mapLocation) {
      mapLocation = this.userPosition;
    }

    this.service.nearbySearch({
      location: mapLocation,
      radius: 10000,
      type: ['restaurant']
    }, (results: any, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.results = results;
        this.results.forEach((item) => {
          this.position = {
            lat: item.geometry.location.lat(),
            lng: item.geometry.location.lng()
          };
          this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.position,
            cursor: 'pointer'
          });
          this.markers.push(this.marker);
          this.marker.position = new google.maps.LatLng(this.position.lat, this.position.lng);
          item.distance = Math.trunc(google.maps.geometry.spherical.computeDistanceBetween
            (this.marker.position, this.userPosition));
          if (item.distance > 1000) {
            item.distanceInKm = (item.distance / 1000).toString().slice(0, -1) + 'km';
          } else {
            item.distance = item.distance.toString() + 'm';
          }
        });
        this.mapService.setMarkers(this.markers);
      }
    });

    this.map.addListener('dragend', () => {
      window.setTimeout(() => {
        let lat = this.map.getCenter().lat();
        let lng = this.map.getCenter().lng();
        var mapLocation = { lat: lat, lng: lng };
        this.searchAround(mapLocation);
      }, 100);
    });

    this.markers.forEach((marker) => {
      marker.addListener('click', () => {
      });
    });
    this.map.setZoom(12);
  }

  getDetails(restaurant) {
    this.showDetails = true;
    this.selectedRestaurant = restaurant;
    this.service.getDetails({
      placeId: this.selectedRestaurant.place_id,
      fields: ['formatted_phone_number', 'review', 'formatted_address', 'website', 'opening_hours']
    }, (placeResult, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.selectedRestaurant = Object.assign(this.selectedRestaurant, placeResult);
        if (this.selectedRestaurant.photos && this.selectedRestaurant.photos[0].getUrl) {
          for (let i = 0; i < this.selectedRestaurant.photos.length; i++) {
            this.photo = this.selectedRestaurant.photos[i].getUrl({ maxWidth: 1000, maxHeight: 1000 });
            this.selectedRestaurant.photos[i] = this.photo;
          }
        } else if (this.selectedRestaurant.photo && this.selectedRestaurant.photo.getUrl) {
          this.photo = this.selectedRestaurant.photo.getUrl({ maxWidth: 1000, maxHeight: 1000 });
          this.selectedRestaurant.photos[0] = this.photo;
        }
      }
      this.displaySelectedRestaurant();
    });
  }

  displaySelectedRestaurant() {
    if (!this.map.getBounds().contains(this.selectedRestaurant.geometry.location)) {
      this.selectedRestaurant.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.selectedRestaurant.geometry.location,
        cursor: 'pointer'
      });
      this.map.setCenter(this.selectedRestaurant.geometry.location);
    }
    this.restaurantService.getRestaurantDetails(this.selectedRestaurant);
  }

  getPositionOnMap(restaurant) {
    for (let i = 0; i < this.markers.length; i++) {
      if (restaurant.geometry.location.lat() === this.markers[i].position.lat()) {
        if (this.previousMarker) {
          this.previousMarker.setIcon();
        }
        this.markers[i].setIcon('../../assets/img/pointer-specific.png');
        this.map.panTo(this.markers[i].position);
        this.previousMarker = this.markers[i];
      }
    }
  }

  sortByGlobalNote(restaurants) {
    restaurants.sort((a, b) => {
      return b.rating - a.rating;
    })
    this.results = restaurants;
  }

  sortByPriceRange(restaurants) {
    restaurants.sort((a, b) => {
      if (!a.price_level) {
        a.price_level = 1;
      } else if (!b.price_level) {
        b.price_level = 1;
      }
      return a.price_level - b.price_level;
    });
    this.results = restaurants;
  }

  sortByDistance(restaurants) {
    restaurants.sort((a, b) => {
      a.sort = parseInt(a.distance, 10);
      b.sort = parseInt(b.distance, 10);
      return a.sort - b.sort;
    });
    this.results = restaurants;
  }

  sortByRatingsTotal(restaurants) {
    restaurants.sort((a, b) => {
      return b.user_ratings_total - a.user_ratings_total;
    });
    this.results = restaurants;
  }

  goBackToResults() {
    this.showDetails = false;
    this.value = "";
    this.map.setCenter(this.userPosition);
    setTimeout(() => {
      this.activateAutocomplete();
    }, 1000);
  }

}
