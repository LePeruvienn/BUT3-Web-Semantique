import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentHubComponent } from './monument-hub.component';

describe('MonumentHubComponent', () => {
  let component: MonumentHubComponent;
  let fixture: ComponentFixture<MonumentHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonumentHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
