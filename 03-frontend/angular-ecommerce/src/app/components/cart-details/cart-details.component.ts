import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartBasket } from 'src/app/utilities/cart-basket';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartBasket[] = [];
  sumPrice: number = 0;
  sumQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.dislayCartDetails();
  }

  dislayCartDetails() {

    // referring to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart sumPrice
    this.cartService.sumPrice.subscribe(
      data => this.sumPrice = data
    );

    // subscribe to the cart sumQuantity
    this.cartService.sumQuantity.subscribe( 
      data => this.sumQuantity = data
    );

    // calculate cart total price and quantity
    this.cartService.calculateCartTotals();
  }

  increaseQuantity(cartItem: CartBasket)
  {
    this.cartService.addToCart(cartItem);
  }

  decreaseQuantity(cartItem: CartBasket)
  {
    this.cartService.decreaseQuantity(cartItem);
  }

  remove(cartItem: CartBasket)
  {
    this.cartService.remove(cartItem);

  }

}
