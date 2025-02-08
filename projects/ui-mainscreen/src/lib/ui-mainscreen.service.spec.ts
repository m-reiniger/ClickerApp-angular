import { TestBed } from '@angular/core/testing';

import { UiMainscreenService } from './ui-mainscreen.service';

describe('UiMainscreenService', () => {
  let service: UiMainscreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiMainscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
