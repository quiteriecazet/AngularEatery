import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRestaurantsComponent } from './selected-restaurants.component';

describe('SelectedRestaurantsComponent', () => {
  let component: SelectedRestaurantsComponent;
  let fixture: ComponentFixture<SelectedRestaurantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedRestaurantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
