import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { } from 'googlemaps';
import { MapsComponent } from '../maps/maps.component';
import { MatGridList, MatFormFieldModule, MatButtonModule, MatMenuModule, MatToolbarModule, MatCardModule } from '@angular/material';
import { typesList } from '../../types';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { FormArray, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { restaurantsList } from '../../restaurant';
import { Restaurant } from '../../restaurant.model';
import { Rating } from '../../rating.model';
import { MapService } from '../../services/map/map.service';
import { GeolocationService } from '../../services/geolocation/geolocation.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss']
})
export class AddRestaurantComponent implements AfterViewInit {

  @ViewChild(MapsComponent)
  map;
  types;
  foodType;
  selectedType;
  autocomplete;
  input;
  marker;
  address;
  restaurant = {};
  isConfirmation = false;
  latLng;
  markers: any = [];
  geocoder = new google.maps.Geocoder;
  markerLocation;
  locationValue = '';
  locationName = '';
  locationRating = 0;
  newRestaurant;
  lastId: number;

  constructor (private mapService: MapService, private geolocationService: GeolocationService) { }

  ngAfterViewInit() {
    this.map = this.mapService.getMap();
    this.geolocationService.getGeolocation(position => 
      this.mapService.displayGeolocation(position)
    );
    this.types = typesList;
    this.foodType = 'Type de cuisine';
    this.input = document.getElementById('location');
    this.autocomplete = new google.maps.places.Autocomplete(this.input);
    this.autocomplete.addListener('place_changed', () => {
      this.onLocationClick();
    });
    this.onMapClick();
  }
  

  isSelected(type) {
    this.foodType = type.name;
    console.log(this.foodType);
  }

  onMapClick() {
    this.map.addListener('click', (e) => {
      this.addMarker(e.latLng);
    });
  
  }

  onLocationClick() {
    this.address = this.autocomplete.getPlace();
    if (this.address.geometry) {
      this.map.panTo(this.address.geometry.location);
      this.map.setZoom(15);
      this.addMarker(this.address.geometry.location);
    }
  }

  addMarker(location) {
    if (this.marker) {
      this.marker.setMap(null);
    };
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: location,
      cursor: 'pointer'
    });
    this.getAddressFromCoordinates(location);
  }

  addRestaurant() {
    this.isConfirmation = true;
    console.log(this.restaurant);
  }

  getAddressFromCoordinates(location) {
    this.markerLocation = { lat: parseFloat(location.lat()), lng: parseFloat(location.lng())};
    this.geocoder.geocode({'location': this.markerLocation}, (results, status) => {
      if (results[0]) {
      this.locationValue = results[0].formatted_address;
      }
    });
  }

  setRating(e) {
    this.locationRating = e;
  }

  clearMap() {
    this.markers = [];
  }

}
