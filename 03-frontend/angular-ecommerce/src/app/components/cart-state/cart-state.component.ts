import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-state',
  templateUrl: './cart-state.component.html',
  styleUrls: ['./cart-state.component.css']
})
export class CartStateComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartState();
  }

  updateCartState() {

    // when new events are received, ake assignments to the UI

    // Track updates to the cart's total price.
    this.cartService.sumPrice.subscribe(
      data => this.totalPrice = data
    );

    // Track updates to the cart's total quantity.
    this.cartService.sumQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
