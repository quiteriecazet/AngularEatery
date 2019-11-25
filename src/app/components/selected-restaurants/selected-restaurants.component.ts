import { Component, Directive, HostListener, Input, ViewChild, NgZone, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { MatGridListModule, MatToolbarModule, MatExpansionPanel } from '@angular/material';
import {
  MatCardModule, MatListModule, MatDividerModule, MatSidenav, MatButtonToggleModule,
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { restaurantsList, Restaurant } from '../../restaurant';
import { CommonModule } from '@angular/common';
import { } from 'googlemaps';
import { MapsComponent } from '../maps/maps.component';
import { NgxStarsModule } from 'ngx-stars';
import { MapService } from '../../services/map/map.service';
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
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>
  selectedRestaurants: Restaurant[];
  geolocation;
  currentUserPosition: Geolocation;
  marker;
  map;
  type;
  markers: any = [];
  selectedRes: any = [];
  selectedResType: string;
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
  constructor(private activatedRoute: ActivatedRoute, private mapService: MapService, private geolocationService: GeolocationService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.map = this.mapService.getMap();
    this.geolocationService.getGeolocation(position =>
      this.position = position
    );
    this.getSelectedRestaurants();
    this.activatedRoute.fragment.subscribe(params => {
      if (params == '' && this.position) {
        this.mapService.displayGeolocation(this.position);
      }
      this.displayRestaurants(params);
    })
    this.initForm();
  }

  ngOnDestroy() {
    this.clearMap();
  }

  clearMap() {
    this.selectedRes = [];
    this.selectedResType = null;
    this.hasResults = false;
    if (this.markers && this.markers.length > 0) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  }

  getSelectedRestaurants(): void {
    this.mapService.getSelectedRestaurants().subscribe(selectedRestaurants => {
      this.selectedRestaurants = selectedRestaurants;
    });
  }

  displayRestaurants(type) {
    this.getSelectedRestaurants();
    this.clearMap();
    if (this.viewPanels) {
      this.viewPanels.forEach(p => p.close());
    }
    for (let i = 0; i < this.selectedRestaurants.length; i++) {
      const pos = {
        lat: this.selectedRestaurants[i].lat,
        lng: this.selectedRestaurants[i].long
      };
      if (pos && type == null && this.map.getBounds().contains(pos)
        || pos && this.selectedRestaurants[i].type === type && this.map.getBounds().contains(pos) || type === 'fromDB') {

        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: pos,
          cursor: 'pointer'
        });
        this.getAverageNotation(this.selectedRestaurants[i]);
        this.map.panTo(pos);
        this.markers.push(this.marker);
        this.selectedResType = type;
        this.selectedRes.push(this.selectedRestaurants[i]);
        this.hasResults = true;
      }
    }

    this.markers.forEach((marker) => {
      marker.addListener('mouseover', () => {
        if (this.previousCurrent) {
          this.previousCurrent.setIcon();
        }
        this.marker.setIcon('../../assets/img/pointer-specific.png');
        for (let i = 0; i < this.selectedRestaurants.length; i++) {
          if (this.marker.position.lat() === this.selectedRestaurants[i].lat && this.marker.position.lng() === this.selectedRestaurants[i].long) {
            this.currentRestaurant = document.getElementById('' + this.selectedRestaurants[i].id + '');
            this.currentRestaurant.classList.add("current");
            this.previousCurrent = marker;
          }
        }
      })

      this.marker.addListener('mouseout', () => {
        this.currentRestaurant.classList.remove("current");
      })
    })
  }

  onDragEvent($event) {
    this.displayRestaurants(null);
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
}


