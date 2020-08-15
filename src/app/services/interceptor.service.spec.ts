import { TestBed, inject } from '@angular/core/testing';

import { StocksInterceptor } from './interceptor.service';

describe('StocksInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StocksInterceptor]
    });
  });

  it('should be created', inject([StocksInterceptor], (service: StocksInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
