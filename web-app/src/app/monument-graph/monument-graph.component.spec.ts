import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentGraphComponent } from './monument-graph.component';

describe('MonumentGraphComponent', () => {
  let component: MonumentGraphComponent;
  let fixture: ComponentFixture<MonumentGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonumentGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
