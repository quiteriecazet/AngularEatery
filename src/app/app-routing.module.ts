import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SelectedRestaurantsComponent } from './components/selected-restaurants/selected-restaurants.component';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { HomepageComponent } from './components/homepage/homepage.component';

export const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'selected-restaurants', component: SelectedRestaurantsComponent },
  { path: 'restaurants', component: RestaurantsComponent },
  { path: 'detail/:restaurant.id', component: RestaurantDetailComponent },
  { path: 'add-restaurant', component: AddRestaurantComponent },
  {
    path: 'homepage', component: HomepageComponent, children: [
      { path: 'selected-restaurants', component: SelectedRestaurantsComponent },
      { path: 'restaurants', component: RestaurantsComponent },
      { path: 'detail/:restaurant.id', component: RestaurantDetailComponent },
      { path: 'add-restaurant', component: AddRestaurantComponent }
    ]
  },
  { path: '**', redirectTo: '/homepage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
