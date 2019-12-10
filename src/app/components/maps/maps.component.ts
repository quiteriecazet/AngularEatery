import { Component, Input, ViewChild, NgZone, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MatGridListModule, MatToolbarModule, MatIconModule, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MapService } from './../../services/map/map.service';
import { GeolocationService } from './../../services/geolocation/geolocation.service';
import { } from 'googlemaps';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

export class MapsComponent implements OnInit {
  map: google.maps.Map;

  @ViewChild('gmap') gmapElement: any;
  position: any;

  constructor(private route: ActivatedRoute, public snackBar: MatSnackBar, private mapService: MapService, 
  private geolocationService: GeolocationService) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('gmap'), {
      center: { lat: 48.870186, lng: 2.340815},
      zoom: 12
    });
  }

  setGeolocation(): Observable<any> {
    this.geolocationService.getGeolocation(position => {
      this.openSnackBar('Nous vous avons trouvé!', 'Fermer');
      this.position = position;
      this.mapService.setGeolocation(this.position, true, this.map, false);
    });
    window.setTimeout(() => {
      if (!this.position) {
        this.mapService.setGeolocation(null, false, this.map, false);
      }
    }, 2000);
    return of(this.position);
  }

  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-class'];
    this.snackBar.open(message, action, {
      duration: 15000,
    });
  }

}



