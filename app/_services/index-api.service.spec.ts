import { TestBed } from '@angular/core/testing';

import { IndexApiService } from './index-api.service';

describe('IndexApiService', () => {
  let service: IndexApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
