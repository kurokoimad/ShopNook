package com.ShopNook.ecommerce.dto;

import lombok.Data;

@Data
public class PaymentInformation
{
    private int amount;
    private String currency;
    private String receiptEmail;
}
