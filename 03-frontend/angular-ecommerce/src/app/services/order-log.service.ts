import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLog } from '../utilities/order-log';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderLogService {

  private orderLogUrl = environment.shopnookApiUrl + '/orders';

  constructor(private httpClient: HttpClient)
  {}

  getOrderLog(userEmail: string): Observable<GetOrderLogResponse> {

    // building the URL based on the customer email
    const orderLogUrl = `${this.orderLogUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;

    return this.httpClient.get<GetOrderLogResponse>(orderLogUrl);
  }
}

interface GetOrderLogResponse
{
  _embedded: {
    orders: OrderLog[];
  }
}
