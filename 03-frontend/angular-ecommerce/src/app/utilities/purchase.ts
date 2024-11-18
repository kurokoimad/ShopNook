import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase 
{
    customer: Customer;
    deliveryAddress: Address;
    paymentAddress: Address;
    order: Order;
    orderItemSet: OrderItem[]; 

    constructor() {
        this.customer = new Customer();
        this.deliveryAddress = new Address();
        this.paymentAddress = new Address();
        this.order = new Order();
        this.orderItemSet = [];
    }
}
