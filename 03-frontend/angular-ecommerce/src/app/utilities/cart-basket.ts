import { Product } from "./product";

export class CartBasket 
{
    id: string;
    name:string;
    pictureUrl: string
    itemPrice: number;

    quantity: number;

    constructor(product: Product)
    {
        this.id = product.id;
        this.name = product.name;
        this.pictureUrl = product.pictureUrl;
        this.itemPrice = product.itemPrice;
        
        this.quantity = 1;
    }
    
}
