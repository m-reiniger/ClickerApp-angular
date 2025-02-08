import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMainscreenComponent } from './ui-mainscreen.component';

describe('UiMainscreenComponent', () => {
  let component: UiMainscreenComponent;
  let fixture: ComponentFixture<UiMainscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMainscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiMainscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
