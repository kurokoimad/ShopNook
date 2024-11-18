package com.ShopNook.ecommerce.service;

import com.ShopNook.ecommerce.dto.PaymentInformation;
import com.ShopNook.ecommerce.dto.Purchase;
import com.ShopNook.ecommerce.dto.PurchaseResult;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService
{
    PurchaseResult submitOrder(Purchase purchase);

    PaymentIntent generatePaymentIntent(PaymentInformation paymentInformation) throws StripeException;

}
