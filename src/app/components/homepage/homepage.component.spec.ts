import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive, HostListener, Input, ViewChild, NgZone, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MatGridListModule, MatToolbarModule } from '@angular/material';
import {
  MatCardModule, MatListModule, MatDividerModule, MatSidenavModule, MatButtonToggleModule,
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { restaurantsList, Restaurant } from '../../restaurant';
import { CommonModule } from '@angular/common';
import { } from 'googlemaps';
import { MapsComponent } from '../maps/maps.component';
import { NgxStarsModule } from 'ngx-stars';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
