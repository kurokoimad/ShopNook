import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CartBasket } from 'src/app/utilities/cart-basket';
import { Product } from 'src/app/utilities/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number | null = null;
  previousCategoryId: number | null = null;

  searchMethod: boolean = false;

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 8;
  totalItems: number = 0;

  formerKeyword: string = "";



  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {

    this.searchMethod = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMethod) {
      this.manageSearchProducts();
    }
    else {
      this.manageProductList();
    }
  }

  manageSearchProducts() {
    const myKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // Setting thePageNumber to 1, if the keyword is different from the previous one

    if (this.formerKeyword != myKeyword) {
      this.pageNumber = 1;
    }

    this.formerKeyword = myKeyword;

    console.log(`keyword=${myKeyword}, pageNumber=${this.pageNumber}`);

    // searching for the products using the given keyword
    this.productService.searchProductsPaginated(this.pageNumber - 1, this.pageSize, myKeyword)
                           .subscribe(this.processProductData());
  }


  manageProductList() {
    // Check if category ID is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
  
    if (hasCategoryId) {
      // Get the "id" param string. Convert string to number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // No category ID available, set to null to fetch all categories
      this.currentCategoryId = null;
    }
  
    // Reset page number if the category changes
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1;
    }
  
    this.previousCategoryId = this.currentCategoryId;
  
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);
  
    // Get products, fetch all categories if currentCategoryId is null
    if (this.currentCategoryId !== null) {
      this.productService.getProductListPaginated(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
        .subscribe(this.processProductData());
    } else {
      this.productService.getAllProductsPaginated(this.pageNumber - 1, this.pageSize)
        .subscribe(this.processProductData());
    }
  }
  

  processProductData() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalItems = data.page.totalElements;
    };
  }
  updatePageSize(pageSize: string)
  {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addItemToCart(myProduct: Product) {
    
    console.log(`Adding to the shopping cart: ${myProduct.name}, ${myProduct.itemPrice}`);

    const cartItem = new CartBasket(myProduct);

    this.cartService.addToCart(cartItem);
  }
}
