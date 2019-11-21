import { Component, Directive, HostListener, Input, ViewChild, NgZone, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MatGridListModule, MatToolbarModule } from '@angular/material';
import {
  MatCardModule, MatListModule, MatDividerModule, MatSidenav, MatButtonToggleModule,
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { restaurantsList, Restaurant } from '../../restaurant';
import { CommonModule } from '@angular/common';
import { } from 'googlemaps';
import { MapsComponent } from '../maps/maps.component';
import { RestaurantsComponent } from './../restaurants/restaurants.component';
import { RestaurantDetailComponent } from './../restaurant-detail/restaurant-detail.component';
import { NotificationsComponent } from './../notifications/notifications.component';
import { AddRestaurantComponent } from './../add-restaurant/add-restaurant.component';
import { SelectedRestaurantsComponent } from './../selected-restaurants/selected-restaurants.component';
import { NgxStarsModule } from 'ngx-stars';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
  }

}
