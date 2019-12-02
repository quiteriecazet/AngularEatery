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

export class RestaurantsComponent implements AfterViewInit, OnDestroy, OnChanges {

  @ViewChild(MapsComponent)
  private mapsComponent: MapsComponent;
  place: any;
  lat: number;
  lng: number;
  results: { forEach: (arg0: (item: any) => void) => void; };
  location: { lat: number; lng: number; };
  input: any;
  pos: { lat: any; lng: any; };
  marker;
  distance: any;
  previousMarker: { setIcon: () => void; };
  markers: any = [];
  placeResults: any;
  showDetails = false;
  bounds;
  map;
  photo;
  service
  selectedRestaurant;
  inputRestaurant;
  autocomplete;
  inputResult: any;
  value: string;
  options = {
    types: ["establishment"]
  }
  userPosition: google.maps.LatLng;
  constructor(private restaurantService: RestaurantService, private mapService: MapService, 
              private geolocationService: GeolocationService, private route: ActivatedRoute,
              private _ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.map = this.mapService.getMap();
    this.userPosition = this.mapService.getLatLngPosition();
    this.map.setCenter(this.userPosition);
    this.service = new google.maps.places.PlacesService(this.map);
    this.bounds = new google.maps.LatLngBounds();
    this.inputRestaurant = document.getElementById('location');
    this.autocomplete = new google.maps.places.Autocomplete(this.inputRestaurant, this.options);
    this.autocomplete.addListener('place_changed', () => {
      this.inputResult = this.autocomplete.getPlace();
      if (this.inputResult.geometry) {
        this.getDetails(this.inputResult);
        this.value = "";
      }
    });
  }

  ngOnDestroy() {
    this.mapService.clearMap(this.markers);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.autocomplete.addListener('place_changed', () => {
      this.inputResult = this.autocomplete.getPlace();
      if (this.inputResult.geometry) {
        this.getDetails(this.inputResult);
      }
    });
  }

  searchAround() {
    this.clearMap();
    if (!this.map) {
      this.ngAfterViewInit();
    }
    this.lat = this.map.getCenter().lat();
    this.lng = this.map.getCenter().lng();
    this.location = { lat: this.lat, lng: this.lng };
    this.service.nearbySearch({
      location: this.location,
      radius: 10000,
      type: ['restaurant']
    }, (results: any, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.results = results;
        this.results.forEach((item) => {
          this.pos = {
            lat: item.geometry.location.lat(),
            lng: item.geometry.location.lng()
          };
          this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.pos,
            cursor: 'pointer'
          });
          this.markers.push(this.marker);
          this.marker.pos = new google.maps.LatLng(this.pos.lat, this.pos.lng);
          // this.bounds.extend(this.marker.pos);
          item.distance = Math.trunc(google.maps.geometry.spherical.computeDistanceBetween
            (this.marker.pos, new google.maps.LatLng(this.lat, this.lng)));
          if (item.distance > 1000) {
            item.distanceInKm = (item.distance / 1000).toString().slice(0, -1) + 'km';
          } else {
            item.distance = item.distance.toString() + 'm';
          }
        });
      }
    });

    this.map.addListener('dragend', () => {
      window.setTimeout(() => {
        this.searchAround();
      }, 1000);
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
        if (!this.map.getBounds().contains(this.selectedRestaurant.geometry.location)) {
         this.mapService.setGeolocation(this.selectedRestaurant.geometry.location) 
        };
        this.restaurantService.getRestaurantDetails(this.selectedRestaurant);
        //this.restaurantDetailComponent.showDetails(restaurant);
      }
    });
  }

  getPositionOnMap(restaurant) {
    for (let i = 0; i < this.markers.length; i++) {
      if (restaurant.geometry.location.lat() === this.markers[i].position.lat()) {
        if (this.previousMarker) {
          this.previousMarker.setIcon();
        }
        this.markers[i].setIcon('../../assets/img/pointer-specific.png');
        this.map.panTo(this.markers[i].pos);
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

  clearMap() {
    this.markers = [];
  }

  goBackToResults() {
    this.showDetails = false;
    this.value = "";
    this.ngAfterViewInit();
  }

}
