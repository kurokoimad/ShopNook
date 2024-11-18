package com.ShopNook.ecommerce.dto;

import com.ShopNook.ecommerce.entity.*;
import lombok.Data;

import java.util.*;

@Data
public class Purchase
{
    private Customer customer;
    private Address deliveryAddress;
    private Address paymentAddress;
    private Order order;
    private Set<OrderItem> orderItemSet;

}
