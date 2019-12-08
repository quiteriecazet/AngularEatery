import { Component, Directive, HostListener, Input, ViewChild, NgZone, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { MatGridListModule, MatToolbarModule, MatExpansionPanel } from '@angular/material';
import {
  MatCardModule, MatListModule, MatDividerModule, MatSidenav, MatButtonToggleModule,
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule,
  MatTooltipModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { restaurantsList, Restaurant } from '../../restaurant';
import { CommonModule } from '@angular/common';
import { } from 'googlemaps';
import { MapsComponent } from '../maps/maps.component';
import { NgxStarsModule } from 'ngx-stars';
import { MapService } from '../../services/map/map.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service'
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { Geolocation } from '../../geolocation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Rating } from 'src/app/rating.model';

@Component({
  selector: 'app-selected-restaurants',
  templateUrl: './selected-restaurants.component.html',
  styleUrls: ['./selected-restaurants.component.scss']
})
export class SelectedRestaurantsComponent implements OnInit, OnDestroy {

  @ViewChild(MapsComponent)
  private mapsComponent: MapsComponent;
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>
  selectedRestaurants: Restaurant[];
  geolocation;
  currentUserPosition: Geolocation;
  marker;
  map;
  type;
  markers: any = [];
  selectedRes: any = [];
  position;
  types: any = [];
  hasResults = false;
  panelOpenState = false;
  chosenType = document.getElementsByClassName('chosenType');
  noChosenType = 'Les types de cuisine populaires';
  previousMarker;
  commentAreaDisplay = false;
  commentForm: FormGroup;
  sidenav: MatSidenav;
  userPosition;
  value;
  currentRestaurant: HTMLElement;
  previousCurrent: any;
  notation: any;
  comment: Rating;
  panorama: any;
  bounds: google.maps.LatLngBounds;
  selectedRestaurantType: any;
  dragListener: any;
  subscription: any;
  isDragged: boolean = false;
  positionSubscription: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private geolocationService: GeolocationService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.map = this.mapService.getMap();
    this.map.setZoom(13);
    this.getSelectedRestaurants();
    this.activatedRoute.fragment.subscribe(params => {
      if (params == '') {
        this.positionSubscription = this.mapService.getLatLngPosition().subscribe(
          position => {
            this.userPosition = position;
          }
        )
        this.map.setCenter(this.userPosition);
      }
      this.displayRestaurants(params);
    })
    this.initForm();
  }

  ngOnDestroy() {
    google.maps.event.clearListeners(this.map, 'dragend');
    google.maps.event.removeListener(this.dragListener);
    this.subscription ? this.subscription.unsubscribe() : null;
    this.positionSubscription.unsubscribe();
    this.clearMap();
  }

  clearMap() {
    this.selectedRes = [];
    this.selectedRestaurantType = null;
    this.hasResults = false;
  }

  getSelectedRestaurants(): void {
    this.subscription = this.restaurantService.getSelectedRestaurants().subscribe(selectedRestaurants => {
      this.selectedRestaurants = selectedRestaurants;
    });
  }

  displayRestaurants(type?) {
    if (this.isDragged) {
      !this.isDragged;
    }
    this.type = type;
    this.getSelectedRestaurants();
    this.clearMap();
    this.bounds = new google.maps.LatLngBounds();
    if (this.viewPanels) {
      this.viewPanels.forEach(p => p.close());
    }
    for (let i = 0; i < this.selectedRestaurants.length; i++) {
      const restaurantPosition = {
        lat: this.selectedRestaurants[i].lat,
        lng: this.selectedRestaurants[i].long
      };
      if (restaurantPosition && type == "" && this.map.getBounds().contains(restaurantPosition)
        || restaurantPosition && this.selectedRestaurants[i].type === this.type && this.map.getBounds().contains(restaurantPosition)
        || this.type === 'fromDB') {

        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: restaurantPosition,
          cursor: 'pointer'
        });

        this.getAverageNotation(this.selectedRestaurants[i]);
        this.markers.push(this.marker);
        this.selectedRestaurantType = this.type;
        this.selectedRes.push(this.selectedRestaurants[i]);
        this.hasResults = true;
      }
    }

    this.mapService.setMarkers(this.markers);

    if (this.markers.length > 0 && this.type === 'fromDB') {
      for (let i = 0; i < this.markers.length; i++) {
        this.bounds.extend(this.markers[i].getPosition())
      }
      this.map.fitBounds(this.bounds);
    }

    this.dragListener = this.map.addListener('dragend', () => {
      window.setTimeout(() => {
        this.isDragged = true;
        this.displayRestaurants(this.type);
      }, 500);
    });
  }

  getAverageNotation(restaurant) {
    let average = 0;
    for (let i = 0; i < restaurant.ratings.length; i++) {
      average += restaurant.ratings[i].notation;
    }
    restaurant.average = (average / restaurant.ratings.length).toFixed(2);
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
  }

  getPositionOnMap(restaurant) {
    for (let i = 0; i < this.markers.length; i++) {
      if (restaurant.lat === this.markers[i].position.lat()) {
        if (this.previousMarker) {
          this.previousMarker.setIcon();
        }
        this.markers[i].setIcon('../../assets/img/pointer-specific.png');
        this.previousMarker = this.markers[i];
      }
    }
  }

  toggleComment(restaurant) {
    this.commentAreaDisplay = !this.commentAreaDisplay;
  }

  initForm() {
    this.commentForm = this.formBuilder.group({
      'name': ['', [
        Validators.required,
        Validators.minLength(1),
      ]],
      'comment': ['', [
        Validators.required,
        Validators.minLength(10),
      ]]
    })
  }

  addComment(restaurant) {
    const formValue = this.commentForm.value;
    const comment = new Rating(
      formValue['name'],
      this.notation,
      formValue['comment']
    )
    restaurant.ratings.unshift(comment);
    this.toggleComment(restaurant);
  }

  onRatingSet($event) {
    this.notation = $event;
  }

  displayStreetView(restaurant) {
    console.log(restaurant)
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('panorama' + restaurant.id), {
      position: { lat: restaurant.lat, lng: restaurant.long },
      pov: {
        heading: 34,
        pitch: 10
      }
    });
    this.map.setStreetView(this.panorama);
  }

  recenterMap() {
    this.map.setCenter(this.userPosition);
    this.isDragged = false;
    this.displayRestaurants();
  }
}


