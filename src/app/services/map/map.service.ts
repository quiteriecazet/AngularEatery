import { Injectable } from '@angular/core';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { } from 'googlemaps';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
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
  geocoder = new google.maps.Geocoder;
  address;
  LatLngPosition: google.maps.LatLng;
  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, private geolocationService: GeolocationService) { }

  getMap() {
    this.clearMap();
    return this.map;
  }

  setGeolocation(position?, geolocated?, map?, hasChangedLocation?) {
    if (map) {
      this.map = map;
      if (!position && geolocated === false) {
        this.userPosition = this.map.center;
      } else {
      this.userPosition = position;
      }
      this.displayLocation(geolocated, hasChangedLocation);
    }
  }

  displayLocation(geolocated, hasChangedLocation) {
    if (this.userPosition && this.userPosition.coords) {
      this.LatLngPosition = new google.maps.LatLng(this.userPosition.coords.latitude, this.userPosition.coords.longitude);
    } else {
      this.LatLngPosition = this.userPosition;
    }

    if (geolocated) {
      this.openSnackBar('Nous vous avons trouvé!', 'Fermer');
    } else if (geolocated === false && hasChangedLocation === false) {
      // tslint:disable-next-line: max-line-length
      this.openSnackBar('Nous n\'avons pas pu vous géolocaliser pour le moment, la vue par défaut est à Paris, vous pourrez changer cela à tout moment.', 'Fermer');
    } else if (geolocated === false && hasChangedLocation === true) {
      this.openSnackBar('Vous pouvez désormais rechercher des restaurants depuis cette localisation!', 'Fermer');
    }
    this.clearMap();
    this.map.setCenter(this.LatLngPosition);
    this.getLatLngPosition();
    this.getAddressFromCoordinates();
    if (this.userPositionMarker) {
      this.userPositionMarker.setMap(null);
    }
    this.userPositionMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.LatLngPosition,
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
          this.setGeolocation(this.userPosition, false, this.map, true);
        }
        return result;
      }).catch((error) => {
        return null;
      });
  }

  getGeolocation() {
    if (this.userPosition) {
      return this.userPosition;
    }
  }

  getLatLngPosition(): Observable<any> {
    if (this.LatLngPosition) {
      return of(this.LatLngPosition);
    }
  }

  setMarkers(markers) {
    this.markers = markers;
  }

  getMarkers() {
    return this.markers;
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
    this.geocoder.geocode({ 'location': this.LatLngPosition }, (results, status) => {
      if (results[0]) {
        return this.address = results[0].formatted_address;
      }
      return null;
    });
  }

  clearMap() {
    if (this.markers) {
      if (this.markers.length > 0) {
        for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
      } else if (this.markers.visible) {
        this.markers.setMap(null);
      }
      this.markers;
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
