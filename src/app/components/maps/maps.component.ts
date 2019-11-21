import { Component, Input, ViewChild, NgZone, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MatGridListModule, MatToolbarModule, MatIconModule, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MapService } from './../../services/map/map.service';
import { } from 'googlemaps';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

export class MapsComponent implements OnInit {
  map;
  marker;
  markers: any = [];
  LatLngPosition;

  @ViewChild('gmap') gmapElement: any;

  constructor(private route: ActivatedRoute, public snackBar: MatSnackBar, private mapService: MapService) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('gmap'), {
      center: { lat: 40.8534, lng: 6.3488 },
      zoom: 14
    });
  }

  displayGeolocation(position) {
    this.LatLngPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.mapService.setGeolocation(this.map, this.LatLngPosition);
    this.openSnackBar('Nous vous avons trouvé!', 'Fermer')   
  }

  clearMap(markers?, selectedResType?) {
    if (markers && markers.length > 0) {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    }
    markers = [];
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



