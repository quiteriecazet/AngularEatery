import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import {
  MatGridListModule, MatToolbarModule, MatExpansionModule, MatButtonToggleModule, MatCardModule, MatButtonModule,
  MatMenuModule, MatDividerModule, MatListModule, MatSidenavModule, MatFormFieldModule, MatInputModule, MatChipsModule,
  MatSnackBarModule, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatProgressSpinnerModule, MatBottomSheetModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxStarsModule } from 'ngx-stars';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { SelectedRestaurantsComponent } from './components/selected-restaurants/selected-restaurants.component';
import { GoogleMapsDirective } from './google-maps.directive';
import { MapsComponent } from './components/maps/maps.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UniqueResultsPipe } from './pipes/unique-results.pipe';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModifyAddressDialog } from './dialogs/modify-address-dialog/modify-address-dialog';
import { LegalMentionsSheet } from './dialogs/legal-mentions-dialog/legal-mentions-dialog';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: AppComponent },
  { path: 'selected-restaurants', component: SelectedRestaurantsComponent },
  { path: 'restaurants', component: RestaurantsComponent },
  { path: 'detail/:id', component: RestaurantDetailComponent }
];

export const apiKey = 'AIzaSyDKfiljHPgRVtQZdjApoZdgJqHK8wyanpA';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantsComponent,
    RestaurantDetailComponent,
    SelectedRestaurantsComponent,
    GoogleMapsDirective,
    MapsComponent,
    UniqueResultsPipe,
    AddRestaurantComponent,
    ModifyAddressDialog,
    LegalMentionsSheet
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    MatDialogModule,
    NgbModule,
    GooglePlaceModule,
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserAnimationsModule,
    NgxStarsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    ModifyAddressDialog,
    LegalMentionsSheet
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {

  constructor(router: RouterModule) {

  }

}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}