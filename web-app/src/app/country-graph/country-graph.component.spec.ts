import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryGraphComponent } from './country-graph.component';

describe('CountryGraphComponent', () => {
  let component: CountryGraphComponent;
  let fixture: ComponentFixture<CountryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
