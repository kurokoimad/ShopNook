package com.ShopNook.ecommerce.controller;

import com.ShopNook.ecommerce.dto.PaymentInformation;
import com.ShopNook.ecommerce.dto.Purchase;
import com.ShopNook.ecommerce.dto.PurchaseResult;
import com.ShopNook.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController
{
    private Logger logger = Logger.getLogger(getClass().getName());

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService)
    {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResult submitOrder(@RequestBody Purchase purchase)
    {
        return checkoutService.submitOrder(purchase);
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> generatePaymentIntent(@RequestBody PaymentInformation paymentInformation) throws StripeException {

        logger.info("paymentInformation.BillAmount" + paymentInformation.getAmount());

        PaymentIntent paymentIntent = checkoutService.generatePaymentIntent(paymentInformation);

        String paymentString = paymentIntent.toJson();

        return new ResponseEntity<>(paymentString, HttpStatus.OK);
    }

}
