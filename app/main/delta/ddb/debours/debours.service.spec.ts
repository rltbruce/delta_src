import { TestBed } from '@angular/core/testing';

import { DeboursService } from './debours.service';

describe('DeboursService', () => {
  let service: DeboursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeboursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
