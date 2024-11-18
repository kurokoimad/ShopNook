import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartStateComponent } from './cart-state.component';

describe('CartStateComponent', () => {
  let component: CartStateComponent;
  let fixture: ComponentFixture<CartStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
