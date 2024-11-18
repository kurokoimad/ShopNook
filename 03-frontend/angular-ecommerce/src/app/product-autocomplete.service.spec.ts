import { TestBed } from '@angular/core/testing';

import { ProductAutocompleteService } from './product-autocomplete.service';

describe('ProductAutocompleteService', () => {
  let service: ProductAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
