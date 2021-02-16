import { TestBed } from '@angular/core/testing';

import { Error.InterceptorsService } from './error.interceptors.service';

describe('Error.InterceptorsService', () => {
  let service: Error.InterceptorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Error.InterceptorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
