import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../utilities/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInformation } from '../utilities/payment-information';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseApiUrl = environment.shopnookApiUrl + '/checkout/purchase';

  private paymentIntentApiUrl = environment.shopnookApiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) { }

  submitOrder(purchase: Purchase): Observable<any> 
  {
    return this.httpClient.post<Purchase>(this.purchaseApiUrl, purchase);    
  }

  generatePaymentIntent(paymentInformation: PaymentInformation): Observable<any> 
  {
    return this.httpClient.post<PaymentInformation>(this.paymentIntentApiUrl, paymentInformation);
  }
}
