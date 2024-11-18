import { TestBed } from '@angular/core/testing';

import { ShopNookFormService } from './shop-nook-form.service';

describe('ShopNookFormService', () => {
  let service: ShopNookFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopNookFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
