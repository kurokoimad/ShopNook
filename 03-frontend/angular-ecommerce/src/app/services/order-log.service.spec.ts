import { TestBed } from '@angular/core/testing';

import { OrderLogService } from './order-log.service';

describe('OrderLogService', () => {
  let service: OrderLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
