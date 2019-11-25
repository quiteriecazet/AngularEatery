import { Injectable } from '@angular/core';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { restaurantsList, Restaurant } from '../../restaurant';
import { } from 'googlemaps';
import { MatSnackBar, MatSnackBarConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModifyAddressDialog } from 'src/app/dialogs/modify-address-dialog/modify-address-dialog';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  previousMarker = null;
  userPositionMarker;
  map;
  markers;
  userPosition;
  userAddress;
  selectedRestaurants = restaurantsList;
  geocoder = new google.maps.Geocoder;
  address;
  LatLngPosition: google.maps.LatLng;
  constructor(public snackBar: MatSnackBar, public dialog: MatDialog) { }

  getMap() {
    return this.map;
  }

  setGeolocation(map, LatLngPosition) {
    if (!this.map) {
      this.map = map;
    }
    this.userPosition = LatLngPosition;
    this.clearMap(this.markers);
    this.openSnackBar('Nous vous avons trouvé!', 'Fermer');
    this.map.setCenter(this.userPosition);
    this.getAddressFromCoordinates();

    this.userPositionMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.userPosition,
      icon: '../../assets/img/pointer-user.png'
    });

    this.userPositionMarker.addListener('click', () => {
      this.modifyAddress();
    });
  }

  modifyAddress(): Promise<any> {
    this.getAddressFromCoordinates()
    const dialogRef = this.dialog.open(ModifyAddressDialog, {
      data: this.address
    });
    return dialogRef.afterClosed()
      .toPromise()
      .then((result) => {
        if (result) {
          this.address = result.formatted_address;
          this.userPosition = result.geometry.location;
          this.setGeolocation(this.map, this.userPosition);
        }
        return result;
      }).catch((error) => {
        return null;
      })
  }

  getGeolocation() {
    if (this.userPosition) {
      return this.userPosition;
    }
  }

  displayGeolocation(position) {
    this.LatLngPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.setGeolocation(this.map, this.LatLngPosition);
    this.openSnackBar('Nous vous avons trouvé!', 'Fermer')
  }

  setMarkers(markers) {
    this.markers = markers;
  }

  getMarkers() {
    return this.markers;
  }

  public getSelectedRestaurants(): Observable<Restaurant[]> {
    return of(this.selectedRestaurants);
  }

  setRestaurantPosition(restaurant) {
    for (let i = 0; i < this.markers.length; i++) {
      if (restaurant.lat && restaurant.lat === this.markers[i].position.lat()
        || restaurant.geometry && restaurant.geometry.location.lat() === this.markers[i].position.lat()) {
        if (this.previousMarker) {
          this.previousMarker.setIcon();
        }
        this.markers[i].setIcon('../../assets/img/pointer-specific.png');
        this.previousMarker = this.markers[i];
      }
    }
  }

  getAddressFromCoordinates = () => {
    this.geocoder.geocode({ 'location': this.userPosition }, (results, status) => {
      if (results[0]) {
        return this.address = results[0].formatted_address;
      }
      return null;
    });
  }

  clearMap(markers?, selectedResType?) {
    if (markers && markers.length > 0) {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    }
    markers = [];
    this.userPositionMarker ? this.userPositionMarker.setMap(null) : null;
    if (selectedResType) {
      selectedResType = null;
    }
  }

  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-class'];
    this.snackBar.open(message, action, {
      duration: 15000,
    });
  }
}
