import { Component, OnInit, ViewChild, Input, AfterViewInit, AfterContentInit } from '@angular/core';
import { } from 'googlemaps';
import { MapsComponent } from '../maps/maps.component';
import { MatGridList, MatFormFieldModule, MatButtonModule, MatMenuModule, MatToolbarModule, MatCardModule } from '@angular/material';
import { typesList } from '../../types';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { restaurantsList } from '../../restaurant';
import { Restaurant } from '../../restaurant.model';
import { Rating } from '../../rating.model';
import { MapService } from '../../services/map/map.service';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { ChangeDetectorRef,AfterContentChecked} from '@angular/core';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss']
})
export class AddRestaurantComponent implements OnInit, AfterViewInit {

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
  isConfirmation;
  latLng;
  markers: any = [];
  geocoder = new google.maps.Geocoder;
  markerLocation;
  locationValue = '';
  locationName = '';
  locationRating = 0;
  newRestaurant;
  lastId: number;
  restaurantForm: FormGroup;
  rating: Rating;
  userPosition: google.maps.LatLng;
  constructor(private mapService: MapService, private geolocationService: GeolocationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.restaurantForm;
    this.map = this.mapService.getMap();
    this.userPosition = this.mapService.getLatLngPosition();
    this.map.setCenter(this.userPosition);
    this.types = typesList;
    this.isConfirmation = false;
    this.foodType = { name: 'Type de cuisine', url: null };
    this.onMapClick();
    this.initForm();
  }

  ngAfterViewInit() {
    this.input = document.getElementById('location');
    this.autocomplete = new google.maps.places.Autocomplete(this.input);
    this.autocomplete.addListener('place_changed', () => {
      this.onLocationClick();
    });
  }

  initForm() {
    this.restaurantForm = this.formBuilder.group({
      'name': ['', [
        Validators.required,
        Validators.minLength(1),
      ]],
      'description': ['', [
        Validators.required,
        Validators.minLength(10),
      ]],
      'comment': ['', [
        Validators.required,
        Validators.minLength(10),
      ]],
      'username': ['', [
        Validators.required,
        Validators.minLength(1),
      ]],
    })
  }

  onSubmit() {
    const formValue = this.restaurantForm.value;
    this.rating = new Rating(formValue['username'], this.locationRating, formValue['comment']);
    const restaurant = new Restaurant(
      15,
      formValue['name'],
      this.locationValue,
      this.markerLocation.lat,
      this.markerLocation.lng,
      this.foodType.name,
      formValue['description'],
      [this.rating]
    )
    this.newRestaurant = restaurant;
    this.isConfirmation = true;
  }


  isSelected(type) {
    this.foodType = type;
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

  getAddressFromCoordinates(location) {
    this.markerLocation = { lat: parseFloat(location.lat()), lng: parseFloat(location.lng()) };
    this.geocoder.geocode({ 'location': this.markerLocation }, (results, status) => {
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
