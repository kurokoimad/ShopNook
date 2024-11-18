import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopNookFormService } from 'src/app/services/shop-nook-form.service';
import { Country } from 'src/app/utilities/country';
import { Order } from 'src/app/utilities/order';
import { OrderItem } from 'src/app/utilities/order-item';
import { PaymentInformation } from 'src/app/utilities/payment-information';
import { Purchase } from 'src/app/utilities/purchase';
import { State } from 'src/app/utilities/state';
import { ShopNookValidators } from 'src/app/validators/shop-nook-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  formGroupCheckout!: FormGroup;

  sumPrice: number = 0;
  sumQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  deliveryAddressStates: State[] = [];
  paymentAddressStates: State[] = [];

  dataStorage: Storage = sessionStorage;

  // initialising the Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  
  paymentInformation: PaymentInformation = new PaymentInformation();
  displayError: any = "";
  cardElement: any;

  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder, private shopNookFormService: ShopNookFormService,
    private cartService: CartService, private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {

    // Initialize the Stripe payment processing form
    this.initializeStripePaymentForm();

    this.summaryCartDetails();

    // retrieve the customer's  email address from the session storage
    const storedEmail = JSON.parse(this.dataStorage.getItem('userEmail')!);

    this.formGroupCheckout = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace]),

        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace]),

        phoneNumber: new FormControl('',
          [Validators.required,
          Validators.pattern('^\\+[0-9]{1,15}$')]), // Ensure a plus sign followed by 1-15 digits

        email: new FormControl(storedEmail,
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      deliveryAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace])
      }),
      paymentAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopNookValidators.notOnlyWhitespace])
      }),
      cardDetails: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // cardHolderName: new FormControl('',
        //   [Validators.required,
        //   Validators.minLength(2),
        //   ShopNookValidators.notOnlyWhitespace]),
        // cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        // CVV: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        // expiryMonth: new FormControl('', [Validators.required]),
        // expiryYear: new FormControl('', [Validators.required])
      })
    });

    // populate the months (C)

    // const firstMonth: number = new Date().getMonth() + 1;
    // console.log("firstMonth: " + firstMonth);

    // this.shopNookFormService.fetchCreditCardMonths(firstMonth).subscribe(
    //   data => {
    //     console.log("fetching the months: " + JSON.stringify(data));
    //     this.creditCardMonths = data;
    //   }
    // );

    // // populate the years 

    // this.shopNookFormService.fetchCreditCardYears().subscribe(
    //   data => {
    //     console.log("fetching the years: " + JSON.stringify(data));
    //     this.creditCardYears = data;
    //   }
    // );

    // populate countries

    this.shopNookFormService.getCountriesList().subscribe(
      data => {
        console.log("fetched countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }
  initializeStripePaymentForm() 
  {
    // Obtain a reference to the Stripe Elements instance
    var elements = this.stripe.elements();

    // Create a card input field without showing the postal code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Mount the card input component into the 'card-element' container
    this.cardElement.mount('#card-element');

    // Bind an event listener to handle changes in the card input field
    this.cardElement.on('change', (event: any) => {

      // card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) 
      {
        this.displayError.textContent = "";
      } 
      else if (event.error) 
      {
        // Display validation errors to the customer
        this.displayError.textContent = event.error.message;
      }

    });
  }
  summaryCartDetails() {

    // sumQuantity cartService subscription
    this.cartService.sumQuantity.subscribe(
      sumQuantity => this.sumQuantity = sumQuantity
    );

    // sumPrice cartService subscription
    this.cartService.sumPrice.subscribe(
      sumPrice => this.sumPrice = sumPrice
    );
  }

  // Getters for the customer section
  get firstName() {
    return this.formGroupCheckout.get('customer.firstName');
  }
  get lastName() {
    return this.formGroupCheckout.get('customer.lastName');
  }
  get phoneNumber() {
    return this.formGroupCheckout.get('customer.phoneNumber');
  }
  get email() {
    return this.formGroupCheckout.get('customer.email');
  }


  // Getters for the delivery Address section 
  get deliveryAddressAvenue() {
    return this.formGroupCheckout.get('deliveryAddress.street');
  }
  get deliveryAddressCity() {
    return this.formGroupCheckout.get('deliveryAddress.city');
  }
  get deliveryAddressState() {
    return this.formGroupCheckout.get('deliveryAddress.state');
  }
  get deliveryAddressCountry() {
    return this.formGroupCheckout.get('deliveryAddress.country');
  }
  get deliveryAddressZipCode() {
    return this.formGroupCheckout.get('deliveryAddress.zipCode');
  }

  // Getters for the payment Address section 
  get paymentAddressAvenue() {
    return this.formGroupCheckout.get('paymentAddress.street');
  }
  get paymentAddressCity() {
    return this.formGroupCheckout.get('paymentAddress.city');
  }
  get paymentAddressState() {
    return this.formGroupCheckout.get('paymentAddress.state');
  }
  get paymentAddressCountry() {
    return this.formGroupCheckout.get('paymentAddress.country');
  }
  get paymentAddressZipCode() {
    return this.formGroupCheckout.get('paymentAddress.zipCode');
  }

  // Getters for the credit card section 
  get creditCardType() {
    return this.formGroupCheckout.get('cardDetails.cardType');
  }
  get creditCardHolderName() {
    return this.formGroupCheckout.get('cardDetails.cardHolderName');
  }
  get creditCardNumber() {
    return this.formGroupCheckout.get('cardDetails.cardNumber');
  }
  get creditCardVerificationCode() {
    return this.formGroupCheckout.get('cardDetails.CVV');
  }
  get creditCardExpiryMonth() {
    return this.formGroupCheckout.get('cardDetails.expiryMonth');
  }
  get creditCardExpiryYear() {
    return this.formGroupCheckout.get('cardDetails.expiryYear');
  }

  manageYearsAndMonths() {
    const cardDetailsFormGroup = this.formGroupCheckout.get('cardDetails');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(cardDetailsFormGroup!.value.expiryYear);

    // starting with the current month, if the current year is the same as the selected year. 

    let firstMonth: number;

    if (currentYear === selectedYear) {
      firstMonth = new Date().getMonth() + 1;
    }
    else {
      firstMonth = 1;
    }

    this.shopNookFormService.fetchCreditCardMonths(firstMonth).subscribe(
      data => {
        console.log("the fetched  months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  copyDeliveryAddressToPaymentAddress(event: any): void {
    if (event.target.checked) {
      this.formGroupCheckout.controls['paymentAddress']
        .setValue(this.formGroupCheckout.controls['deliveryAddress'].value);

      this.paymentAddressStates = this.deliveryAddressStates;
    }
    else {
      this.formGroupCheckout.controls['paymentAddress'].reset();

      this.paymentAddressStates = [];
    }
  }

  submitPurchase() {
    console.log("we are handling purchase submissison");

    if (this.formGroupCheckout.invalid) {
      this.formGroupCheckout.markAllAsTouched();
      return;
    }

    // Initialize the order info
    let order = new Order();
    order.sumPrice = this.sumPrice;
    order.sumQuantity = this.sumQuantity;

    // Retrieving the cart items
    const cartItems = this.cartService.cartItems;

    // Generate orderItems from cartItems
    let orderItemSet: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // generate the purchase
    let purchase = new Purchase();

    // fill the purchase for the customer
    purchase.customer = this.formGroupCheckout.controls['customer'].value;

    // fill the purchase for the delivery address
    purchase.deliveryAddress = this.formGroupCheckout.controls['deliveryAddress'].value;
    const deliveryState: State = JSON.parse(JSON.stringify(purchase.deliveryAddress.state));
    const deliveryCountry: Country = JSON.parse(JSON.stringify(purchase.deliveryAddress.country));
    purchase.deliveryAddress.state = deliveryState.name;
    purchase.deliveryAddress.country = deliveryCountry.name;

    // fill the purchase for the payment address
    purchase.paymentAddress = this.formGroupCheckout.controls['paymentAddress'].value;
    const paymentState: State = JSON.parse(JSON.stringify(purchase.paymentAddress.state));
    const paymentCountry: Country = JSON.parse(JSON.stringify(purchase.paymentAddress.country));
    purchase.paymentAddress.state = paymentState.name;
    purchase.paymentAddress.country = paymentCountry.name;

     // filling the purchase for order and orderItemSet
     purchase.order = order;
     purchase.orderItemSet = orderItemSet;

     // calculate the payment information
     this.paymentInformation.amount = Math.round(this.sumPrice * 100);
     this.paymentInformation.currency = "EUR";
     this.paymentInformation.receiptEmail = purchase.customer.email;

     console.log(`this.paymentInformation.amount:${this.paymentInformation.amount}`)

    // If the form is valid:
    // - Create a payment intent for processing
    // - Confirm the payment using the provided card details
    // - Finalize and place the order

    if (!this.formGroupCheckout.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.generatePaymentIntent(this.paymentInformation).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.paymentAddress.street,
                    city: purchase.paymentAddress.city,
                    state: purchase.paymentAddress.state,
                    postal_code: purchase.paymentAddress.zipCode,
                    country: this.paymentAddressCountry!.value.code
                  }
                }
              }
            }, { handleActions: false })
          .then((result: any) => {
            if (result.error) 
            {
              // Oooops, alerting the customer that there was an error
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            } 
            else
            {
              // Invoke REST API through CheckoutService
              this.checkoutService.submitOrder(purchase).subscribe({
                next: (response: any) => {
                  alert(`Your order has been received.\nOrder tracking refrence: ${response.orderTrackingReference}`);

                  // clear cart
                  this.clearCart();
                  this.isDisabled = false;
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              })
            }            
          }).catch((error: any) => {
            alert(`Unexpected error: ${error.message}`);
            this.isDisabled = false;
          });
        }
      );
    } 
    else 
    {
      this.formGroupCheckout.markAllAsTouched();
      return;
    }

  }

  clearCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.sumPrice.next(0);
    this.cartService.sumQuantity.next(0);
    this.cartService.saveCartItems();
    
    // reset the form
    this.formGroupCheckout.reset();

    // swing back to the main page of products
    this.router.navigateByUrl("/products");
  }

  getStatesList(formSectionName: string) {
    const formGroup = this.formGroupCheckout.get(formSectionName)!; // non-null assertion

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formSectionName} country code: ${countryCode}`);
    console.log(`${formSectionName} country name: ${countryName}`);

    this.shopNookFormService.getStatesList(countryCode).subscribe(
      data => {
        if (formSectionName === 'deliveryAddress') {
          this.deliveryAddressStates = data;
        } else {
          this.paymentAddressStates = data;
        }

        // select first item by default, optional chaining to safely set the value
        formGroup.get('state')?.setValue(data[0]);
      }
    );
  }
}
