import { CartBasket } from './cart-basket';

export class OrderItem {
    pictureUrl: string;
    itemPrice: number;
    quantity: number;
    productId: string;

    constructor(cartBasket: CartBasket) {
        this.pictureUrl = cartBasket.pictureUrl;
        this.quantity = cartBasket.quantity;
        this.itemPrice = cartBasket.itemPrice;
        this.productId = cartBasket.id;
    }
}
