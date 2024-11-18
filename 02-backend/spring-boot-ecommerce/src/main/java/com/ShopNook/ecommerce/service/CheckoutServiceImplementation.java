package com.ShopNook.ecommerce.service;

import com.ShopNook.ecommerce.dao.CustomerRepository;
import com.ShopNook.ecommerce.dto.PaymentInformation;
import com.ShopNook.ecommerce.dto.Purchase;
import com.ShopNook.ecommerce.dto.PurchaseResult;
import com.ShopNook.ecommerce.entity.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImplementation implements  CheckoutService
{
    private CustomerRepository customerRepository;

    public CheckoutServiceImplementation(CustomerRepository customerRepository,
                                         @Value("${stripe.key.secret}") String stripeSecretKey)
    {
        this.customerRepository = customerRepository;

        // Configure Stripe with the provided secret key
        Stripe.apiKey = stripeSecretKey;
    }

    @Override
    @Transactional
    public PurchaseResult submitOrder(Purchase purchase)
    {
        // get the order info from the dto
        Order order = purchase.getOrder();

        // generate tracking reference
        String orderTrackingReference = generateOrderTrackingReference();
        order.setOrderTrackingReference(orderTrackingReference);

        // populating the order with orderItems
        Set<OrderItem> orderItemSet = purchase.getOrderItemSet();
        if (orderItemSet != null) {
            orderItemSet.forEach(order::add);
        }
        // populating order with the Address of delivery and payment
        order.setPaymentAddress(purchase.getPaymentAddress());
        order.setDeliveryAddress(purchase.getDeliveryAddress());

        // populating the customer with the order
        Customer customer = purchase.getCustomer();

        // check if this customer already made a purchase
        String c_email = customer.getEmail();

        Customer customerAlreadyInTheDb = customerRepository.findByEmail(c_email);

        if(customerAlreadyInTheDb != null)
        {
            // we found our customer
            customer = customerAlreadyInTheDb;
        }
        customer.add(order);

        // saving into the DB
        customerRepository.save(customer);

        // return a response
        return new PurchaseResult(orderTrackingReference);
    }

    @Override
    public PaymentIntent generatePaymentIntent(PaymentInformation paymentInformation) throws StripeException {
        List<String> supportedPaymentMethods = new ArrayList<>();
        supportedPaymentMethods.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInformation.getAmount());
        params.put("currency", paymentInformation.getCurrency());
        params.put("payment_method_types", supportedPaymentMethods);
        params.put("description", "Shopnook purchase");
        params.put("receipt_email", paymentInformation.getReceiptEmail());

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingReference()
    {
        // create a UUId Number (version 4.0)
        return UUID.randomUUID().toString();
    }
}
