/// <reference types="@types/googlemaps" />

import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appGoogleMaps]'
})
export class GoogleMapsDirective implements OnInit {
private element: HTMLInputElement;

  constructor(private elRef: ElementRef) {
    this.element = elRef.nativeElement;
   }

  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element);
  }
}
