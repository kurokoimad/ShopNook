import { Component, OnInit } from '@angular/core';
import { OrderLogService } from 'src/app/services/order-log.service';
import { OrderLog } from 'src/app/utilities/order-log';

@Component({
  selector: 'app-order-log',
  templateUrl: './order-log.component.html',
  styleUrls: ['./order-log.component.css']
})
export class OrderLogComponent implements OnInit {

  orderLogList: OrderLog[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderLogService: OrderLogService) { }

  ngOnInit(): void 
  {
    this.manageOrderLog();
  }

  manageOrderLog() {

    // retrieving the user's email address from browser session storage
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // Fetch order log data using the user's email address
    this.orderLogService.getOrderLog(userEmail).subscribe(
      data => {
        // Store the retrieved order data in the orderLogList property
        this.orderLogList = data._embedded.orders;
      }
    );
  }

}
